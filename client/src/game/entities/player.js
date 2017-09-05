import { generateId } from "utils"

export default function Player(entity) {
  const sprite = new PIXI.Sprite(
    PIXI.loader.resources["creatures"].textures["creature-player-default-1.png"]
  )

  const nameStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 12,
    fontWeight: "bold",
    fill: "#ffffff"
  })

  const nameText = new PIXI.Text(entity.name, nameStyle)

  nameText.anchor.x = 0.5
  nameText.anchor.y = 0.5

  nameText.x = 0
  nameText.y = -sprite.height

  sprite.addChild(nameText)

  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.5

  sprite.position.x = entity.x
  sprite.position.y = entity.y

  return {
    ...entity,

    sprite
  }
}
