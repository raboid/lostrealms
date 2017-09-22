import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

import { generateId } from 'utils';

export default class Welcome extends PureComponent {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  getInput() {
    return {
      email: this.refs.email.value.trim(), 
      password: this.refs.password.value.trim()
    };
  }

  handleLogin(event) {
    event.preventDefault();
    this.props.onLogin(this.getInput())
  }

  handleRegister(event) {
    event.preventDefault();
    this.props.onRegister(this.getInput())
  }

  render() {
    return (
      <div className="welcome container">
        <div className="welcome-banner">
          Lost Realms
        </div>
        <div className="welcome-auth">
          <form>
            <input type='text' ref='email' className="form-control" placeholder='Email' />
            <input type='password' ref='password' className="form-control" placeholder='Password' />
            <LoginButton onLogin={this.handleLogin} />
            <RegisterButton onRegister={this.handleRegister} />
          </form>
        </div>
      </div>
    );
  }
}

const RegisterButton = ({onRegister}) => (
  <button className="btn btn-primary" onClick={onRegister}>
    Register
  </button>
);

const LoginButton = ({onLogin}) => (
  <button className="btn btn-primary" onClick={onLogin}>
    Login
  </button>
);