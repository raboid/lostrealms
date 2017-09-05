import { encode, decode } from "./shared/utils"
import { AUTH_ACTIONS } from "./shared/constants"

export default class Client {
  constructor(id, socket, onAction, onClose) {
    this.id = id
    this.socket = socket

    this.handleAction = onAction
    this.handleClose = onClose

    this.socket.on("message", this.onMessage.bind(this))
    this.socket.on("close", this.onClose.bind(this))

    this.authenticated = false

    this.lag = 0

    this.send = this.send.bind(this)
  }

  onMessage(message) {
    const action = decode(message)

    if (this.authenticated || action.type === AUTH_ACTIONS.AUTHENTICATE) {
      this.handleAction(this, action)
    }
  }

  onClose() {
    if (this.authenticated) {
      this.handleClose(this)
    }
  }

  send(action) {
    this.socket.send(encode(action))
  }
}
