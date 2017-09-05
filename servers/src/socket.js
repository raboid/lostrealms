import WebSocket from "uws"

import Server from "./server"
import Client from "./client"
import { REDIS_CHANNELS } from "./constants"
import { ENTITY_ACTIONS, AUTH_ACTIONS } from "./shared/constants"
import * as SharedActions from "./shared/actions"
import * as Actions from "./actions"
import { decode, generateId } from "./shared/utils"

export default class SocketServer extends Server {
  constructor(config) {
    super(config)

    this.clients = {}

    this.entities = {}

    this.updatedEntities = []

    this.wssPort = process.env.PORT || 3000

    this.onClientAction = this.onClientAction.bind(this)
    this.onClientClose = this.onClientClose.bind(this)
    this.onGameChannel = this.onGameChannel.bind(this)
    this.onChatChannel = this.onChatChannel.bind(this)
    this.onEntityChannel = this.onEntityChannel.bind(this)
    this.onPlayerChannel = this.onPlayerChannel.bind(this)
    this.sendUpdatedEntitiesToClients = this.sendUpdatedEntitiesToClients.bind(
      this
    )
    this.updateClient = this.updateClient.bind(this)
    this.updateEntity = this.updateEntity.bind(this)

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

    setInterval(this.sendUpdatedEntitiesToClients, this.timestep)

    console.log('Socket Server listening on port', this.wssPort)
  }

  onClientAction(client, action) {
    console.log("WSS: Action", action)

    if (action.type === AUTH_ACTIONS.AUTHENTICATE) {
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
        console.log("Bad action", action)
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

      this.publish("entities", { type: "player", name })
    })
  }

  onPlayerChannel(player) {
    this.updateEntity(player)

    const client = this.clients[player.name]

    client.playerId = player.id

    client.send(SharedActions.addPlayer(player))
  }

  onEntityChannel(entity) {
    console.log("entity channel", entity)
    this.updateEntity(entity)
  }

  onChatChannel(action) {
    Object.keys(this.clients).forEach(this.updateClient(action))
  }

  onGameChannel(action) {}

  publishEntityAction(action) {
    switch (action.type) {
      case ENTITY_ACTIONS.ACTIONS:
        action.payload.forEach(action => {
          if (typeof action === "string") {
            action = decode(action)
          }
          console.log("socket pub", action)
          const actionHandlers = this.publish(`actions:${action.id}`, action)
          if (!actionHandlers) {
            ///smething
          }
        })
        break
    }
  }

  updateEntity(entity) {
    if (entity.deleted) {
      console.log("deleted", entity, this.entities)
      const localEntity = this.entities[entity.id]
      if (localEntity.type === "player") {
        this.redis.del(`player:${localEntity.name}`)
        delete this.entities[entity.id]
      }
    } else {
      this.entities[entity.id || entity.cid] = entity
    }
    this.updatedEntities.push(entity)
  }

  updateClient(action) {
    return key => {
      this.clients[key].send(action)
    }
  }

  sendUpdatedEntitiesToClients() {
    if (this.updatedEntities.length > 0) {
      console.log("sending updates", this.updatedEntities)
      const action = SharedActions.updatedEntities(this.updatedEntities)
      Object.keys(this.clients).forEach(this.updateClient(action))

      this.updatedEntities = []
    }
  }
}

const config = {
  redis: {
    port: 6379,
    subscriber: true
  },
  tickRate: 20
}

new SocketServer(config)