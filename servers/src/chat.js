import Server from "./server"
import { CHAT_CHANNELS, CHAT_ACTIONS, REDIS_CHANNELS } from "./shared/constants"
import { chatMessage } from "./shared/actions"
import { decode } from "./shared/utils"

const RETRY_TIME = 1000

class ChatServer extends Server {
  constructor(config) {
    super(config)

    this.waitForChatAction()
  }

  waitForChatAction() {
    this.redis.brpop("actions:chat", 0).then(this.onChatAction)
  }

  onChatAction(resultArray) {
    const action = decode(resultArray[1])

    this.updateChat(action)

    this.waitForChatAction()
  }

  updateChat(action) {
    switch (action.type) {
      case CHAT_ACTIONS.MESSAGE:
        switch (action.payload.channel) {
          case CHAT_CHANNELS.GLOBAL:
          case CHAT_CHANNELS.LOCAL:
            this.sendGlobalMessage(action)
            break
          default:
            if (validatePrivateMessage(action)) {
              this.sendPrivateMessage(action)
            } else {
              this.sendNoRecipient(action)
            }
        }
    }
  }

  playerExists(id) {
    return redis.exists(`player:${id}`)
  }

  validatePrivateMessage(action) {
    if (this.playerExists(action.payload.to)) {
      return true
    }
    return false
  }

  sendGlobalMessage(action) {
    this.publish(REDIS_CHANNELS.CHAT, chatMessage(action.payload))
  }

  sendNoRecipient(action) {
    this.publish(action.payload.from, noChatRecipient(action.payload))
  }

  sendPrivateMessage(action) {
    this.publish(action.payload.to, chatMessage(action.payload))
  }
}

const config = {
  redis: {
    port: 6379
  }
}

new ChatServer(config)
