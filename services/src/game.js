// Service for game actions
// EX: Guild actions, leaderboards, achievements, ...

import Service from "./service"

class GameService extends Service {
  constructor(config) {
    super(config)

    this.handleGameAction = this.handleGameAction.bind(this)

    this.subscribe('game', this.handleGameAction)

    this.log('service started')
  }

  handleGameAction(action) {

  }
}

const config = {
  redis: {
    port: 6379,
    subscriber: true,
  },
  name: 'GAME',
}

new GameService(config)
