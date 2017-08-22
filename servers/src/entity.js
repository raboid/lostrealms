import Redis from 'ioredis';

import { ENTITY_ACTIONS } from './constants';
import { encode, decode } from './utils';
import EntitySystem from './systems/entity';

const config = {
  port: 6379,
};

const TICK_RATE = 20

const TIMESTEP = parseInt(1000 / TICK_RATE) //ms

const ENTITY_LIMIT = 10000;

const redis = new Redis(config);
const sub = new Redis(config);

sub.on('message', handleMessage);

const entitySystem = new EntitySystem();

function getEntityId(channel) {
  return channel.split(':')[1];
}

function handleMessage(channel, message) {
  console.log('sub message', channel, message)
  switch(channel) {
    case 'entities':
      handleNewEntity(message)
      break;
    default:
      handleAction(message)
  }
}

function handleAction(action) {
  entitySystem.addAction(decode(action));
}

function handleNewEntity(entity) {
  entity = decode(entity)

  sub.subscribe(`actions:${entity.id}`);

  console.log('subbed', `actions:${entity.id}`);

  entitySystem.addEntity(decode(encode(entity)))
}

function publishUpdate(entity) {
  console.log('publishing', `entity:${entity.id}`);
  redis.publish(`entity:${entity.id}`, encode(entity)).then(listeners => {
    console.log('listeners', listeners)
    if(!listeners) {
      console.log('unsub', entity.id);
      // No one cares about these updates so unsub
      sub.unsubscribe(`actions:${entity.id}`);
      entitySystem.removeEntity(entity);
    }
  }).catch(err => console.log(err))
}

function update() {

  const updatedEntityIds = entitySystem.update()


  if(updatedEntityIds.length === 0) {
    setTimeout(update, TIMESTEP)

    return
  }

  console.log('ENTITY: update', updatedEntityIds)

  const pipeline = redis.pipeline();
  updatedEntityIds.forEach(id => {
    const entity = entitySystem.get(id);
    pipeline.hmset(`entity:${id}`, entity); // only set updated fields?
    publishUpdate(entity);
    console.log('ENTITY: set', entity)
  })

    console.log('ENTITY: finished update 1')

  pipeline.exec((err, results) => console.log(err, results))

  console.log('ENTITY: finished update 2')
      setTimeout(update, TIMESTEP)

}

//redis.brpop('entities', 0).then(handleNewEntity);

sub.subscribe('entities');

setTimeout(update, TIMESTEP)

