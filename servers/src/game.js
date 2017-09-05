import Server from "./server"

const config = {
  redis: {
    port: 6379,
    subscriber: {
      channels: ["game"]
    }
  }
}

new GameServer(config)

class GameServer extends Server {
  constructor(config) {
    super(config)

    console.log('Game Server started')
  }
}
