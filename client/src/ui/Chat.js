import React, { Component } from "react"
import PropTypes from "prop-types"

import { chatMessage } from "../actions"
import { generateId } from "utils"

const stopKeyDownPropogation = event => event.stopPropagation()
const stopKeyUpPropogation = event => event.stopPropagation()

export default class Chat extends Component {
  static propTypes = {
    chat: PropTypes.array.isRequired
  }

  static contextTypes = {
    socket: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  handleFocus() {
    this.domNode.addEventListener("keydown", stopKeyDownPropogation, false)
    this.domNode.addEventListener("keyup", stopKeyUpPropogation, false)
  }

  handleBlur() {
    this.domNode.removeEventListener("keydown", stopKeyDownPropogation)
    this.domNode.removeEventListener("keyup", stopKeyUpPropogation)
  }

  sendMessage(event) {
    if (event.key !== "Enter") {
      return
    }

    const message = this.refs.input.value.trim()

    const time = new Date().toLocaleTimeString()

    this.context.socket.send(chatMessage({ message, time }))

    this.refs.input.value = ""
  }

  /*

            <div style={{
            marginBottom: '5px',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>

          */

  render() {
    return (
      <div
        style={{
          zIndex: 2,
          display: "flex",
          flexGrow: 1,
          backgroundColor: "#42320F",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
          flexDirection: "column",
          cursor: "pointer",
          marginRight: "5px",
          width: "100%"
        }}
        ref={domNode => (this.domNode = domNode)}
      >
        <div
          style={{
            overflowWrap: "break-word",
            overflowY: "scroll",
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            color: "white",
            fontSize: "10px"
          }}
        >
          {this.props.chat.map((msg, i) => {
            return <Message {...msg} key={`chat-msg-${Math.random()}`} />
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <input
            ref="input"
            style={{
              width: "100%",
              borderTop: "2px solid goldenrod",
              backgroundColor: "#42320F",
              color: "white",
              height: "22px",
              padding: "0 5px",
              borderBottom: "0px solid black",
              borderBottomLeftRadius: "5px",
              borderBottomRightRadius: "5px"
            }}
            type="text"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyPress={this.sendMessage}
          />
        </div>
      </div>
    )
  }
}

const Message = ({ channel, time, to, from, message }) => {
  return (
    <div
      style={{
        padding: "4px"
      }}
    >
      [Global]{from}: {message}
    </div>
  )
}
