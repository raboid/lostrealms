// Service for player actions
// EX: Inventory actions, health actions, skill actions, stat actions

import Service from "./service"

class PlayerService extends Service {
  constructor(config) {
    super(config)

    this.handlePlayerAction = this.handlePlayerAction.bind(this)

    this.psubscribe("player:*", this.handlePlayerAction);

    this.log('service started')
  }

  handlePlayerAction(action) {

  }
}

const config = {
  redis: {
    port: 6379,
    subscriber: true,
  },
  name: 'PLAYER',
}

new PlayerService(config)
