import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
  type ReactNode,
  type ClipboardEvent,
  type ChangeEvent,
  type KeyboardEvent
} from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import styles from './CodeEntry.module.css'

export interface CodeEntryHandle {
  clear: () => void
  focus: (index: number) => void
}

export interface CodeEntryProps {
  ref?: ForwardedRef<CodeEntryHandle>
  className?: string
  inputClassName?: string
  focusOnRender?: boolean
  onCode?: (code: string) => Promise<boolean> | boolean
  label?: ReactNode | false
  children?: ReactNode
}

const CODE_LENGTH = 6
const EMTPY_STATE = Array<string>(CODE_LENGTH).fill('')
const KEY_BACKSPACE = 'Backspace'
const KEY_ARROW_LEFT = 'ArrowLeft'
const KEY_ARROW_RIGHT = 'ArrowRight'

const getElementIndex = (refsArr: Array<HTMLInputElement | null>, elem: HTMLInputElement) =>
  refsArr.findIndex((el) => el === elem)

const focusPreviousInput = (refsArr: Array<HTMLInputElement | null>, elem: HTMLInputElement) => {
  refsArr[Math.max(getElementIndex(refsArr, elem) - 1, 0)]?.focus()
}

const focusNextInput = (refsArr: Array<HTMLInputElement | null>, elem: HTMLInputElement) => {
  refsArr[Math.min(getElementIndex(refsArr, elem) + 1, CODE_LENGTH - 1)]?.focus()
}

const moveFocusForArrowKey = (
  refsArr: Array<HTMLInputElement | null>,
  elem: HTMLInputElement,
  key: typeof KEY_ARROW_LEFT | typeof KEY_ARROW_RIGHT
) => {
  const isRTL = getComputedStyle(elem).direction === 'rtl'
  const movesToPrevious = key === KEY_ARROW_LEFT ? !isRTL : isRTL

  if (movesToPrevious) {
    focusPreviousInput(refsArr, elem)
  } else {
    focusNextInput(refsArr, elem)
  }
}

const CodeEntry = ({ ref, className, inputClassName, focusOnRender = false, onCode, label, children }: CodeEntryProps) => {
  const { t } = useTranslation()
  const [validating, setValidating] = useState(false)
  const [code, setCode] = useState(EMTPY_STATE)
  const refs = useRef<Array<HTMLInputElement | null>>([])

  useImperativeHandle(ref, () => ({
    clear () {
      setCode(EMTPY_STATE)
    },
    focus (index) {
      refs.current[index]?.focus()
    }
  }), [])

  const getCode = useCallback(() => code.join('').substring(0, CODE_LENGTH), [code])

  const focusFirstEmptyInput = useCallback(() => {
    const firstEmptyIndex = code.findIndex((digit) => digit === '')
    const targetIndex = firstEmptyIndex === -1 ? CODE_LENGTH - 1 : firstEmptyIndex

    refs.current[targetIndex]?.focus()
  }, [code])

  const tryComplete = useCallback(async (codeValue: string) => {
    setValidating(true)

    try {
      const isValid = await onCode?.(codeValue)

      if (isValid) {
        setCode(EMTPY_STATE)

        if (refs.current[0]) {
          setTimeout(() => refs.current[0]?.focus(), 0)
        }
      } else {
        setTimeout(() => refs.current[CODE_LENGTH - 1]?.focus(), 0)
      }
    } catch (e) {
      if (refs.current[CODE_LENGTH - 1]) {
        setTimeout(() => refs.current[CODE_LENGTH - 1]?.focus(), 0)
      }

      throw e
    } finally {
      setValidating(false)
    }
  }, [onCode])

  // Run the tryComplete function when the code state changes
  useEffect(() => {
    const code = getCode()

    if (code.length !== CODE_LENGTH) {
      return
    }

    void tryComplete(code)
  }, [getCode, tryComplete])

  const setDigit = useCallback((digit: number, value: string) => {
    if (digit > (CODE_LENGTH - 1)) {
      return
    }

    setCode((code) => {
      const updatedCode = [...code]

      updatedCode[digit] = value

      return updatedCode
    })
  }, [])

  const handlePaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
    if (validating) {
      return
    }

    const { clipboardData } = event
    const pastedData = clipboardData.getData('Text').trim()

    // Exit early if the pasted data contains anything other than just digits
    if (!/^[0-9]+$/.test(pastedData)) {
      event.preventDefault()

      return
    }

    const digits = pastedData.split('')
    // Start pasting from the first digit if the clipboard holds a full code,
    // otherwise just paste from the currently selected input onwards
    let digit = pastedData.length === CODE_LENGTH
      ? 0
      : parseInt(event.currentTarget.getAttribute('data-digit') ?? '0', 10)

    digits.forEach((value) => {
      setDigit(digit, value)

      digit += 1
    })

    refs.current[Math.min(digit, CODE_LENGTH - 1)]?.focus()

    event.preventDefault()
  }, [setDigit, validating])

  const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { target, target: { value } } = event
    const digit = parseInt(target.getAttribute('data-digit') ?? '0', 10)
    const digits = value.match(/[0-9]/g) ?? []

    if (digits.length === 0) {
      setDigit(digit, '')

      return
    }

    if (digits.length === 1) {
      setDigit(digit, digits[0])
      focusNextInput(refs.current, target)
    }
  }, [setDigit])

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    const { key, currentTarget, metaKey, ctrlKey } = event

    // On backspace on empty node go back to previous
    if (currentTarget.value.length === 0 && key === KEY_BACKSPACE) {
      focusPreviousInput(refs.current, currentTarget)
    } else if (key === KEY_ARROW_LEFT || key === KEY_ARROW_RIGHT) {
      // Move focus according to visual direction
      moveFocusForArrowKey(refs.current, currentTarget, key)
      event.preventDefault()
    } else if (!metaKey && !ctrlKey && key.length === 1 && !/^[0-9]$/.test(key)) {
      // Prevent non-numeric characters that might appear in numbers (e.g 'e')
      // but allow backspaces too
      event.preventDefault()
    }
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    const { currentTarget, repeat } = event
    const { value } = currentTarget

    if (!repeat && /[0-9]/.test(value)) {
      focusNextInput(refs.current, currentTarget)
    }
  }, [])

  const invalid = !validating && getCode().length === CODE_LENGTH

  return (
    <fieldset
      className={clsx(styles.root, className)}
    >
      {label !== false && (
        <legend
          className={styles.legend}
          onClick={focusFirstEmptyInput}
        >
          <span>{label ?? t('Support code')}</span>
        </legend>
      )}
      <div className={clsx(styles.digits, invalid && styles.invalid)} role='group'>
        {code.map((value, index) => (
          <input
            key={index}
            inputMode='numeric'
            className={clsx(styles.input, inputClassName)}
            disabled={validating}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onChange={handleOnChange}
            onPaste={handlePaste}
            value={value}
            data-digit={index}
            ref={(el) => { refs.current[index] = el }}
            autoFocus={focusOnRender && index === 0}
            aria-label={t('Digit {{digit}}', { digit: index + 1 })}
          />
        ))}
        {children}
      </div>
    </fieldset>
  )
}

export default CodeEntry
