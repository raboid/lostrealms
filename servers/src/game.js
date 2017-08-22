import Redis from 'ioredis';

import Engine from './../../shared/engine';

const config = {
  port: 6379,
};

var redis = new Redis(config);

//redis.blrpop('game').then()

var engine = new Engine();

engine.start();