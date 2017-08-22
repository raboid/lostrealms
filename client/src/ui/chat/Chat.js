import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { chatMessage } from '../../actions';
import { generateId } from 'utils';

import './Chat.css';

const stopKeyDownPropogation = event => event.stopPropagation()
const stopKeyUpPropogation = event => event.stopPropagation()

export default class Chat extends Component {
  static propTypes = {
    chat: PropTypes.array.isRequired
  };

  static contextTypes = {
    socket: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  handleFocus() {
    this.domNode.addEventListener('keydown', stopKeyDownPropogation, false);
    this.domNode.addEventListener('keyup', stopKeyUpPropogation, false);
  }

  handleBlur() {
    this.domNode.removeEventListener('keydown', stopKeyDownPropogation);
    this.domNode.removeEventListener('keyup', stopKeyUpPropogation);
  }

  sendMessage(event) {
    if(event.key !== 'Enter') {
      return;
    }

    const message = this.refs.input.value.trim();

    const time = new Date().toLocaleTimeString();

    this.context.socket.send(chatMessage({ message, time }));

    this.refs.input.value = '';
  }

  render() {
    if(!this.props.show) { return null; }
    return (
      <div className="chat" ref={domNode => this.domNode = domNode}>
        <div className="flex-grow chat-messages">
          {this.props.chat.map((msg,i) => {
            return (
              <Message {...msg} key={`chat-msg-${Math.random()}`} />
            )
          })}
        </div>
        <div className="chat-input">
          <input
            ref='input'
            type='text'
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyPress={this.sendMessage}
          />
        </div>
      </div>
    );
  }
}

const Message = ({ channel, time, to, from, message }) => {
  return (
    <div className="chat-message">
      [{time}][{from}]: {message}
    </div>
  );
};
