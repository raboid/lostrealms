const maxVelocity = 3;
const acceleration = 3;
const friction = .1;
const friction_threshold = .1;

export const ENTITY_ACTIONS = {
  ADD: 'entity.ADD',
  UPDATE: 'entity.UPDATE',
  REMOVE: 'entity.REMOVE',
  MOVE_UP: 'entity.MOVE_UP',
  MOVE_DOWN: 'entity.MOVE_DOWN',
  MOVE_RIGHT: 'entity.MOVE_RIGHT',
  MOVE_LEFT: 'entity.MOVE_LEFT',
  STOP_RIGHT_LEFT: 'entity.STOP_RIGHT_LEFT',
  STOP_UP_DOWN: 'entity.STOP_UP_DOWN',
  ACTIONS: 'entity.ACTIONS',
}

export default class EntitySystem {
  constructor(entities = {}, actions = []) {
    this.entities = entities;
    this.actions = actions;

    this.count = this.count.bind(this)
    this.get = this.get.bind(this)
    this.removeEntity = this.removeEntity.bind(this)
    this.addEntity = this.addEntity.bind(this)
    this.addAction = this.addAction.bind(this)

  }

  count() {
    return Object.keys(this.entities).length;
  }

  get(id) { 
    return this.entities[id];
  }

  removeEntity(entity){
    delete this.entities[entity.id]
  }

  addEntity(entity) {
    console.log('adding entity', entity)
    if(typeof entity === 'object') {
      this.entities[entity.id] = entity;
    }
    return entity;
  }

  addAction(action) {
    if(typeof action === 'object' && action.type) {
      console.log('action added', action)
      this.actions.push(action);
    }
  }

  durationExpired = (entity) => {
    if(entity.duration && entity.startTime + entity.duration < this.currentTime) {
      entity.deleted = true;
      return true;
    }
    return false;
  }

  updatePosition = (entity) => {
    if(!(entity.vX || entity.vY)) {
      return false;
    }

    entity.x += entity.vX// * dt
    entity.y += entity.vY// * dt

    if (entity.sprite) {
      entity.sprite.position.x = entity.x;
      entity.sprite.position.y = entity.y;
    }

    return true;
  }

  applyAction = (updatedEntityIds, action) => {
    const entity = this.entities[action.id];

    switch(action.type) {
      case ENTITY_ACTIONS.MOVE_UP:
        entity.vY = -acceleration
        break;
      case ENTITY_ACTIONS.MOVE_DOWN:
        entity.vY = acceleration
        break;
      case ENTITY_ACTIONS.MOVE_LEFT:
        entity.vX = -acceleration
        break;
      case ENTITY_ACTIONS.MOVE_RIGHT:
        entity.vX = acceleration
        break;
      case ENTITY_ACTIONS.STOP_UP_DOWN:
        entity.vY = 0
        break
      case ENTITY_ACTIONS.STOP_RIGHT_LEFT:
        entity.vX = 0
        break 
      default:
        return updatedEntityIds;
    }

    updatedEntityIds.add(action.id)
    return updatedEntityIds;
  }

  updateEntity = (updatedEntityIds, entity) => {
    if(this.updatePosition(entity) || this.durationExpired(entity)) {
      updatedEntityIds.add(entity.id);
    }
    return updatedEntityIds;
  }

  processUpdate = (updatedEntityId) => {
    const updatedEntity = this.entities[updatedEntityId];
    if(updatedEntity.deleted) {
      this.removeEntity(updatedEntity)
    }
  }

  update = () => {
    //console.log('updating', this.entities)
    this.currentTime = new Date().getTime()

    let updatedEntityIds = this.actions.reduce(this.applyAction, new Set());

    updatedEntityIds = Array.from(Object.values(this.entities).reduce(this.updateEntity, updatedEntityIds));

    updatedEntityIds.forEach(this.processUpdate)

    this.actions = [];

    return updatedEntityIds;
  }
}