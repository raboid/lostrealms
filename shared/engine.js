export default class Engine {
  constructor() {
    this.entities = {};
    this.tick = 0;
  }

  start() {
    setInterval(this.tick.bind(this), 3000);
  }

  getTick() {
    return this.tick;
  }

  addEntity(entity) {
    this.entities[entity.id] = entity;
  }

  removeEntity(id) {
    delete this.entities[id];
  }

  tick() {
    this.tick += 1;
  }
}