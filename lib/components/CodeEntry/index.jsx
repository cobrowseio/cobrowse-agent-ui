import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from './CodeEntry.module.css'

const CODE_LENGTH = 6
const EMTPY_STATE = Array(CODE_LENGTH).fill('')

const getElementIndex = (refsArr, elem) => refsArr.findIndex((el) => el === elem)

const focusPreviousInput = (refsArr, elem) => {
  refsArr[Math.max(getElementIndex(refsArr, elem) - 1, 0)]?.focus()
}

const focusNextInput = (refsArr, elem) => {
  refsArr[Math.min(getElementIndex(refsArr, elem) + 1, CODE_LENGTH - 1)]?.focus()
}

const CodeEntry = ({ ref, className, inputClassName, focusOnRender = false, onCode, children }) => {
  const [validating, setValidating] = useState(false)
  const [code, setCode] = useState(EMTPY_STATE)
  const refs = useRef([])

  useImperativeHandle(ref, () => ({
    clear () {
      setCode(EMTPY_STATE)
    },
    focus (index) {
      refs.current[index]?.focus()
    }
  }), [])

  const getCode = useCallback(() => code.join('').substring(0, CODE_LENGTH), [code])

  const tryComplete = useCallback(async (codeValue) => {
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

    tryComplete(code)
  }, [getCode, tryComplete])

  const setDigit = useCallback((digit, value) => {
    if (digit > (CODE_LENGTH - 1)) {
      return
    }

    setCode((code) => {
      const updatedCode = [...code]

      updatedCode[digit] = value

      return updatedCode
    })
  }, [])

  const handlePaste = useCallback((event) => {
    if (validating) {
      return false
    }

    const clipboardData = event.clipboardData || window.clipboardData
    const pastedData = clipboardData.getData('Text').toString()

    // Exit early if the pasted data contains anything other than just digits
    if (!/^[0-9]+$/.test(pastedData)) {
      return event.preventDefault()
    }

    const digits = pastedData.split('')
    // Start pasting from the first digit if the clipboard holds a full code,
    // otherwise just paste from the currently selected input onwards
    let digit = pastedData.length === CODE_LENGTH
      ? 0
      : parseInt(event.target.getAttribute('data-digit'), 10)

    digits.forEach((value) => {
      setDigit(digit, value)

      digit += 1
    })

    refs.current[Math.min(digit, CODE_LENGTH - 1)]?.focus()

    return event.preventDefault()
  }, [setDigit, validating])

  const handleOnChange = useCallback((event) => {
    const value = event.target.value.slice(-1)
    // validate text on any change
    const digit = parseInt(event.target.getAttribute('data-digit'), 10)

    // Only allow digits and deleting the current value
    if (/[0-9]/.test(value) || value === '') {
      setDigit(digit, value)
    }

    if (!event.repeat && /[0-9]/.test(value)) {
      event.target.value = ''

      focusNextInput(refs.current, event.target)
    }
  }, [setDigit])

  const handleKeyDown = useCallback((event) => {
    // on backspace on empty node go back to previous
    if (event.target.value.length === 0 && event.keyCode === 8) {
      focusPreviousInput(refs.current, event.target)
      // left arrow moves to previous
    } else if (event.keyCode === 37) {
      focusPreviousInput(refs.current, event.target)
      return event.preventDefault()
      // right arrow moves to next
    } else if (event.keyCode === 39) {
      focusNextInput(refs.current, event.target)
      return event.preventDefault()
      // prevent non-numeric characters that might appear in numbers (e.g 'e')
      // but allow backspaces too
    } else if ((!event.metaKey) && (!event.ctrlKey) &&
            (event.keyCode !== 8) && (event.keyCode !== 9) && (!/^[0-9]{1}$/.test(event.key))) {
      return event.preventDefault()
    }

    return null
  }, [])

  const keyHandlers = {
    onKeyDown: handleKeyDown,
    onChange: handleOnChange,
    onPaste: handlePaste,
    disabled: validating
  }

  const invalid = !validating && getCode().length === CODE_LENGTH

  return (
    <div
      data-component='CodeEntry'
      data-validating={validating ? 'true' : 'false'}
      data-invalid={invalid ? 'true' : 'false'}
      className={clsx(styles.root, className)}
    >
      <div className={clsx(styles.digits, invalid && styles.invalid)}>
        {code.map((value, index) => (
          <input
            key={index}
            className={clsx(styles.input, inputClassName)}
            type='number'
            {...keyHandlers}
            value={value}
            data-digit={index}
            ref={(el) => { refs.current[index] = el }}
            autoFocus={focusOnRender && index === 0}
          />
        ))}
        {children}
      </div>
    </div>
  )
}

export default CodeEntry
