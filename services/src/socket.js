import WebSocket from "uws"

import Service from "./service"
import Client from "./client"
import { REDIS_CHANNELS } from "./constants"
import * as SharedActions from "./shared/actions"
import * as Actions from "./actions"
import Types from "./shared/types"
import { decode, generateId } from "./shared/utils"

export default class SocketService extends Service {
  constructor(config) {
    super(config)

    this.clients = {}

    this.entities = {}

    this.updates = []

    this.wssPort = process.env.PORT || 3000

    this.onClientAction = this.onClientAction.bind(this)
    this.onClientClose = this.onClientClose.bind(this)
    this.onGameChannel = this.onGameChannel.bind(this)
    this.onChatChannel = this.onChatChannel.bind(this)
    this.onEntityChannel = this.onEntityChannel.bind(this)
    this.onPlayerChannel = this.onPlayerChannel.bind(this)
    this.sendUpdatesToClients = this.sendUpdatesToClients.bind(this)
    this.updateClient = this.updateClient.bind(this)
    this.addUpdate = this.addUpdate.bind(this)

    this.wss = new WebSocket.Server({ port: this.wssPort })

    this.wss.on("connection", socket => {
      const clientId = generateId()
      this.clients[clientId] = new Client(
        clientId,
        socket,
        this.onClientAction,
        this.onClientClose
      )
    })

    this.subscribe(REDIS_CHANNELS.GAME, this.onGameChannel)
    this.subscribe(REDIS_CHANNELS.CHAT, this.onChatChannel)
    this.psubscribe("entity:*", this.onEntityChannel)

    setInterval(this.sendUpdatesToClients, this.timestep)

    this.log("service started")
    this.log("listening on port", this.wssPort)
  }

  onClientAction(client, action) {
    this.log("WSS: Action", action)

    if (action.type === SharedActions.AUTH_ACTIONS.AUTHENTICATE) {
      this.authenticateClient(client, action)
    } else {
      this.publishClientAction(action)
    }
  }

  onClientClose(client) {
    this.unsubscribe(`entity:${client.playerId}`)
    this.unsubscribe(`player:${client.playerName}`)

    delete this.entities[client.playerId]
    delete this.clients[client.playerName]
  }

  publishClientAction(action) {
    const channel = action.type ? action.type.split(".")[0] : null

    switch (channel) {
      case REDIS_CHANNELS.CHAT:
        this.publish(REDIS_CHANNELS.CHAT, action)
        break
      case REDIS_CHANNELS.GAME:
        break
      case REDIS_CHANNELS.ENTITY:
        this.publishEntityAction(action)
        break
      default:
        this.log("Bad action", action)
    }
  }

  authenticateClient(client, { payload: name }) {
    if (name.length > 12) {
      client.send(Actions.unauthenticated("Too long"))
      return
    }

    if (!/^\w+$/.test(name)) {
      client.send(Actions.unauthenticated("Invalid chars"))
      return
    }

    const playerKey = `player:${name}`

    // Fix race condition here by making this atomic/transaction?
    this.redis.exists(playerKey).then(invalid => {
      if (invalid) {
        client.send(Actions.unauthenticated("Taken"))
        return
      }

      this.subscribe(playerKey, this.onPlayerChannel)

      client.authenticated = true

      client.playerName = name

      client.send(Actions.authenticated())

      client.send(SharedActions.updatedEntities(Object.values(this.entities)))

      delete this.clients[client.id]

      this.clients[client.playerName] = client

      this.publish("entities", { type: Types.PLAYER, name })
    })
  }

  onPlayerChannel(player) {
    const client = this.clients[player.name]

    client.playerId = player.id

    client.send(SharedActions.addPlayer(player))

    this.addUpdate(player)
  }

  onEntityChannel(update) {
    this.addUpdate(update)
  }

  onChatChannel(action) {
    Object.keys(this.clients).forEach(this.updateClient(action))
  }

  onGameChannel(action) {}

  publishEntityAction(action) {
    switch (action.type) {
      case SharedActions.ENTITY_ACTIONS.ACTIONS:
        action.payload.forEach(action => {
          if (typeof action === "string") {
            action = decode(action)
          }
          const actionHandlers = this.publish(`actions:${action.id}`, action)
          if (!actionHandlers) {
            ///smething
          }
        })
        break
    }
  }

  addUpdate(update) {
    this.log("received updated entity", update)

    if (update.deleted) {
      const entity = this.entities[update.id]

      if (entity && entity.type === Types.PLAYER) {
        this.redis.del(`player:${entity.name}`)

        delete this.entities[entity.id]

        this.log("deleted player", entity.name)
      }
    } else {
      this.entities[update.id || update.cid] = {
        ...(this.entities[update.id || update.cid] || {}),
        ...update
      }
    }

    this.updates.push(update)
  }

  updateClient(action) {
    return key => {
      this.clients[key].send(action)
    }
  }

  sendUpdatesToClients() {
    if (this.updates.length > 0) {
      this.log("sending updates", this.updates)
      const action = SharedActions.updatedEntities(this.updates)
      Object.keys(this.clients).forEach(this.updateClient(action))

      this.updates = []
    }
  }
}

const config = {
  redis: {
    port: 6379,
    subscriber: true
  },
  name: "SOCKET",
  tickRate: 20
}

new SocketService(config)
