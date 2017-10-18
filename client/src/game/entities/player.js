export default function Player(entity) {
  let src

  if (entity.gm) {
    src = "creature-djinni-1.png"
  } else {
    src = "creature-beastmaster-brown-1.png"
  }

  const sprite = new PIXI.Sprite(PIXI.loader.resources["sheet"].textures[src])

  if (entity.name) {
    const nameStyle = new PIXI.TextStyle({
      fontFamily: "Verdana",
      fontSize: 12,
      fill: "#ffffff"
    })

    const nameText = new PIXI.Text(entity.name, nameStyle)

    nameText.anchor.x = 0.5
    nameText.anchor.y = 0.5

    nameText.x = 0
    nameText.y = -sprite.height + 4

    sprite.addChild(nameText)
  }

  if (entity.guild) {
    const guildNameStyle = new PIXI.TextStyle({
      fontFamily: "Verdana",
      fontSize: 12,
      fill: "#fff000"
    })

    const guildNameText = new PIXI.Text(
      `<${entity.guild.name}>`,
      guildNameStyle
    )

    guildNameText.anchor.x = 0.5
    guildNameText.anchor.y = 0.5

    guildNameText.x = 0
    guildNameText.y = -sprite.height - 10

    sprite.addChild(guildNameText)
  }

  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.5

  sprite.position.x = entity.x * 24 + 12
  sprite.position.y = entity.y * 24 + 12

  return {
    ...entity,

    sprite
  }
}
