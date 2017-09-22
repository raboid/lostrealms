import Service from "./service"
import EntitySystem from "./systems/entity"
import { ENTITY_ACTIONS } from "./shared/actions"
import Ground from './shared/entities/ground'
import { generateId } from "./shared/utils"

class EntityService extends Service {
  constructor(config) {
    super(config)

    this.onEntitiesChannel = this.onEntitiesChannel.bind(this)
    this.onActionChannel = this.onActionChannel.bind(this)
    this.tick = this.tick.bind(this)

    this.subscribe("entities", this.onEntitiesChannel)

    this.entitySystem = new EntitySystem([], [], this.redis)

    this.entitySystem.addEntity({ type: "wall", sid: generateId(), x: 200, y: 150 })
    this.entitySystem.addEntity({ type: "ground", sid: generateId(), x: 150, y: 150 })

    setTimeout(this.tick, this.timestep)
    this.log('service started')
  }

  tick() {
    setTimeout(this.tick, this.timestep)

    const updatedEntityIds = this.entitySystem.update()

    if (updatedEntityIds.length === 0) {
      return
    }

    this.log("updated entity ids", updatedEntityIds)

    const pipeline = this.redis.pipeline()

    updatedEntityIds.forEach(id => {
      let entity = this.entitySystem.get(id)
      if (!entity) {
        // entity was deleted
        entity = { id, deleted: true }
        pipeline.del(`entity:${id}`)
      } else {
        // update entity in redis
        pipeline.hmset(`entity:${id}`, entity) // only set updated fields?
      }
      this.publishUpdate(entity)
    })

    pipeline.exec()
  }

  publishUpdate(entity) {
    this.log("publishing entity channel", entity)
    this.publish(`entity:${entity.id}`, entity)
      .then(listeners => {
        if (!listeners) {
          // No one cares about these updates so unsub
          this.unsubscribe(`actions:${entity.id}`)

          this.entitySystem.removeEntity(entity)
        }
      })
      .catch(err => this.log(err))
  }

  onEntitiesChannel(entity) {
    this.entitySystem.addEntity(entity).then(entity => {
      if (entity.type === "player") {
        const playerKey = `player:${entity.name}`
        this.redis
          .hmset(playerKey, entity)
          .then(() => this.publish(playerKey, entity))
      }

      this.subscribe(`actions:${entity.id}`, this.onActionChannel)
      this.publish(`entity:${entity.id}`, entity)
    })
  }

  onActionChannel(action) {
    this.log("RECEIVED", action)
    this.entitySystem.addAction(action)
  }
}

const config = {
  redis: {
    port: 6379,
    subscriber: true
  },
  tickRate: 20,
  entityLimit: 10000,
  name: 'ENTITY'
}

new EntityService(config)
