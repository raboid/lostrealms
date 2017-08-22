import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { authenticate } from './actions';

export default class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    invalid: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    if(event.key !== 'Enter') {
      return;
    }
    const name = this.refs.input.value.trim();

    window.LR.name = name;

    this.props.socket.send(authenticate(name))

    this.refs.input.value = '';
  }

  render() {
    return (
      <div className="login">
        <span>Name: </span>
        <input onKeyDown={this.handleLogin} ref="input" />
        {this.props.invalid ? <span>Invalid name submitted</span> : null}
      </div>
    );
  }
}