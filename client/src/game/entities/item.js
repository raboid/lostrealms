import SharedItem from "shared/entities/item"

export default function Item(entity) {
  const sprite = new PIXI.Sprite(
    PIXI.loader.resources["sheet"].textures[entity.src]
  )

  //entity = SharedGround(entity)

  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.5

  sprite.position.x = entity.x * 24 + 12
  sprite.position.y = entity.y * 24 + 12

  return {
    ...entity,

    sprite
  }
}
