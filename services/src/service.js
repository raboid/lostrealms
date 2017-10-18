import Redis from "ioredis"
import { encode, decode } from "./shared/utils"

export default class Service {
  constructor(config) {
    this.config = config

    this.handleSubscriptions = this.handleSubscriptions.bind(this)
    this.handlePSubscriptions = this.handlePSubscriptions.bind(this)

    this.redis = new Redis(config.redis)

    if (config.redis.subscriber) {
      this.sub = new Redis(config.redis)

      this.channels = {}
      this.pchannels = {}

      this.sub.on("message", this.handleSubscriptions)
      this.sub.on("pmessage", this.handlePSubscriptions)
    }

    if (config.tickRate) {
      this.timestep = parseInt(1000 / config.tickRate) //ms
    }
  }

  log(...args) {
    const output = args
      .map(arg => {
        if (typeof arg === "object") {
          return JSON.stringify(arg)
        }
        return arg
      })
      .join(" \n")
    console.log(`[${this.config.name}] ${output}`)
  }

  handleSubscriptions(channel, message) {
    this.channels[channel](decode(message))
  }

  handlePSubscriptions(pattern, channel, message) {
    this.pchannels[pattern](decode(message))
  }

  subscribe(channel, handler) {
    this.channels[channel] = handler
    return this.sub.subscribe(channel)
  }

  psubscribe(pattern, handler) {
    this.pchannels[pattern] = handler
    return this.sub.psubscribe(pattern)
  }

  publish(channel, action) {
    return this.redis.publish(channel, encode(action))
  }

  unsubscribe(channel) {
    delete this.channels[channel]

    return this.sub.unsubscribe(channel)
  }

  unpsubscribe(channel) {
    delete this.pchannels[channel]

    return this.sub.unpsubscribe(channel)
  }
}
