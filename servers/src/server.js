import Redis from 'ioredis';

export default class Server {
  constructor() {
    this.redis = new Redis(config);
  }
}