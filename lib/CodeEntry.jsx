import React, { Component } from 'react'
import './CodeEntry.css'

export default class CodeEntry extends Component {
  constructor () {
    super()
    this.state = { validating: false, code: ['', '', '', '', '', ''] }
  }

  getCode = () => {
    return this.state.code.join('').substr(0, 6)
  }

  setDigit = (digit, value) => {
    if (digit > 5) return
    const code = this.state.code
    code[digit] = value
    this.setState({
      code: [...code]
    })
    this.tryComplete()
  }

  focus = () => {
    this.firstDigit.focus()
  }

  isEditable = () => {
    return (!this.state.validating)
  }

  tryComplete = async () => {
    if (!this.isEditable()) return
    const code = this.getCode()
    if (code.length !== 6) return

    this.setState({ validating: true })
    try {
      if (await this.props.onCode(code)) {
        this.setState({ validating: false })
        this.setState({ code: ['', '', '', '', '', ''] })
        if (this.firstDigit) setTimeout(() => this.firstDigit.focus(), 0)
      } else {
        this.setState({ validating: false })
        if (this.lastDigit) setTimeout(() => this.lastDigit.focus(), 0)
      }
    } catch (e) {
      this.setState({ validating: false })
      if (this.lastDigit) setTimeout(() => this.lastDigit.focus(), 0)
      throw e
    }
  }

  handlePaste = (event) => {
    if (!this.isEditable()) return false
    const clipboardData = event.clipboardData || window.clipboardData
    const pastedData = clipboardData.getData('Text').toString()
    if (!parseInt(pastedData, 10)) return event.preventDefault()
    const digits = pastedData.split('')
    let digit = parseInt(event.target.getAttribute('data-digit'), 10)
    let target = event.target
    digits.forEach((value) => {
      this.setDigit(digit, value)
      digit += 1
      if (target) target = target.nextSibling
    })
    if (target) target.focus()
    return event.preventDefault()
  }

  handleOnChange = (event) => {
    const value = event.target.value.substr(-1)
    // validate text on any change
    const digit = parseInt(event.target.getAttribute('data-digit'), 10)
    this.setDigit(digit, value)

    if (!event.repeat && /[0-9]/.test(value)) {
      event.target.value = ''
      const nextSibling = event.target.nextSibling
      if (nextSibling) nextSibling.focus()
    }
  }

  handleKeyDown = (event) => {
    // on backspace on empty node go back to previous
    if ((event.target.value.length === 0) && (event.keyCode === 8)) {
      if (event.target.previousSibling) event.target.previousSibling.focus()
      // left arrow moves to previous
    } else if (event.keyCode === 37) {
      if (event.target.previousSibling) event.target.previousSibling.focus()
      return event.preventDefault()
      // right arrow moves to next
    } else if (event.keyCode === 39) {
      if (event.target.nextSibling) event.target.nextSibling.focus()
      return event.preventDefault()
      // prevent non-numeric characters that might appear in numbers (e.g 'e')
      // but allow backspaces too
    } else if ((!event.metaKey) && (!event.ctrlKey) &&
            (event.keyCode !== 8) && (event.keyCode !== 9) && (!/^[0-9]{1}$/.test(event.key))) {
      return event.preventDefault()
    }
    return null
  }

  render () {
    const keyHandlers = {
      onKeyDown: this.handleKeyDown,
      onChange: this.handleOnChange,
      onPaste: this.handlePaste,
      disabled: !this.isEditable()
    }
    const invalid = (!this.state.validating) && (this.getCode().length === 6)
    return (
      <div className='CodeEntry'>
        <div className={invalid ? 'invalid' : ''}>
          <input className='bordered' type='number' {...keyHandlers} value={this.state.code[0]} data-digit={0} ref={(c) => { this.firstDigit = c }} />
          <input className='bordered' type='number' {...keyHandlers} value={this.state.code[1]} data-digit={1} />
          <input className='bordered' type='number' {...keyHandlers} value={this.state.code[2]} data-digit={2} />
          <input className='bordered' type='number' {...keyHandlers} value={this.state.code[3]} data-digit={3} />
          <input className='bordered' type='number' {...keyHandlers} value={this.state.code[4]} data-digit={4} />
          <input className='bordered' type='number' {...keyHandlers} value={this.state.code[5]} data-digit={5} ref={(c) => { this.lastDigit = c }} />
        </div>
      </div>
    )
  }
}
