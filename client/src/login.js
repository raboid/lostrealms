import React, { Component } from "react"
import PropTypes from "prop-types"

import torchSrc from 'assets/images/torch.gif'
import { authenticate } from "./actions"

export default class Login extends Component {
  static propTypes = {
    invalid: PropTypes.bool,
    valid: PropTypes.bool,
    socket: PropTypes.object.isRequired
  }

  state = { invalid: false, input: '' }

  constructor(props) {
    super(props)
    this.handleInput = this.handleInput.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.invalid !== this.state.invalid) {
      this.setState({ invalid: nextProps.invalid })
    }
  }

  handleInput(event) {
    if(this.state.invalid) {
      this.setState({ invalid: false })
    }

    this.setState({ input: event.target.value })
  }

  handleKeyDown(event) {
    if (event.key !== "Enter") {
      return
    }

    const name = this.state.input;

    window.LR.name = name

    const action = authenticate(name)

    this.props.socket.send(action)
  }

  render() {

    return (
      <div className="login">
        <Torch valid={this.props.valid} />
        <Input value={this.state.input} invalid={this.state.invalid} onChange={this.handleInput} onKeyDown={this.handleKeyDown} />
        <Torch valid={this.props.valid} />
      </div>
    )
  }
}

const Input = ({ value, invalid, onChange, onKeyDown }) => (
  <input value={value} onChange={onChange} onKeyDown={onKeyDown} style={{
    backgroundColor: invalid ? 'red' : 'gray',
    border: 0
  }} />
)

const Torch = ({ valid }) => (
  <img src={torchSrc} style={{
    filter: valid ? 'hue-rotate(90deg)' : ''
  }} />
);