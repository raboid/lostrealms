import { encode, decode } from "shared/utils"

const DEV_URL = "ws://localhost:3000"
const PROD_URL = "ws://lostrealms.io/ws"

export default class Socket {
  constructor(onAction) {
    this.handleAction = onAction

    this.onMessage = this.onMessage.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.onError = this.onError.bind(this)
    this.connect = this.connect.bind(this)

    this.connect()

    this.lastTimestamp = 0

    this.lag = 0
  }

  connect() {
    this.socket = new WebSocket(DEV_URL)

    this.socket.addEventListener("error", this.onError)

    this.socket.addEventListener("open", this.onOpen)

    this.socket.addEventListener("close", this.onClose)

    this.socket.addEventListener("message", this.onMessage)
  }

  onOpen() {
    console.log("WS opened")
  }

  onError(error) {
    console.log("WS error. Reconnecting")
    //setTimeout(this.connect, 5000)
  }

  onClose() {
    console.log("WS closed. Reconnecting")
    setTimeout(this.connect, 5000)
  }

  onMessage(message) {
    // this.lag = message.timeStamp - this.lastTimestamp;

    // this.lastTimeStamp = message.timeStamp;

    console.log("received", decode(message.data))

    this.handleAction(decode(message.data))
  }

  send(action) {
    if (this.socket) {
      const message = encode(action)
      console.log("sending", message)
      this.socket.send(message)
    }
  }
}
