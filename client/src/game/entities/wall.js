import SharedGround from "shared/entities/ground"

export default function Wall(entity) {
  const sprite = new PIXI.Sprite(
    PIXI.loader.resources["world"].textures["world-wall-brown-1.png"]
  )

  //entity = SharedGround(entity)

  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.5

  sprite.position.x = entity.x
  sprite.position.y = entity.y

  entity.halfWidth = sprite.width / 2
  entity.halfHeight = sprite.height / 2

  entity.centerX = entity.x + entity.halfWidth
  entity.centerY = entity.y + entity.halfHeight

  return {
    ...entity,

    sprite
  }
}