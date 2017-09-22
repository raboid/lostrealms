import Service from "./service"

import { REDIS_CHANNELS } from './constants';
import { CHAT_CHANNELS, } from "./shared/constants"
import { CHAT_ACTIONS, chatMessage } from "./shared/actions"
import { decode } from "./shared/utils"

const RETRY_TIME = 1000

class ChatService extends Service {
  constructor(config) {
    super(config)

    this.waitForChatAction()

    this.log('service started')
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
    port: 6379,
  },
  name: 'CHAT',
}

new ChatService(config)
