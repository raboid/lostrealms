import Objects from "../objects"
import Types from "../types"

const x = 10
const y = 10

const width = 24
const height = 24

const halfWidth = width / 2
const halfHeight = height / 2

export default function Player({ name }) {
  return {
    type: Types.PLAYER,

    collidable: true,

    health: 50,

    maxHealth: 100,

    mana: 50,

    maxMana: 100,

    bags: [
      {
        ...Objects["Rucksack"],
        0: { ...Objects["Small Health Potion"], stack: 74 },
        1: { ...Objects["Silver Ring"] },
        2: { ...Objects["Gold Ring"] },
        3: { ...Objects["Small Mana Potion"], stack: 3 },
        4: { ...Objects["Magma Helmet"] },
        5: { ...Objects["Magma Belt"] },
        6: { ...Objects["Magma Greaves"] },
        7: { ...Objects["Magma Gloves"] },
        8: { ...Objects["Magma Boots"] },
        9: { ...Objects["Magma Breastplate"] },
        10: { ...Objects["Magma Sword"] },
        11: { ...Objects["Magma Shield"] }
      }
    ],

    equipment: {},

    actions: {},

    bindings: {
      ui: {
        toggleMenu: "m"
      },
      game: {
        moveUp: "w",
        moveDown: "s",
        moveLeft: "a",
        moveRight: "d",
        attack: " "
      }
    },

    guild: {
      name: "Salami Cats"
    },

    name,

    width,

    height,

    halfWidth,

    halfHeight,

    centerX: x + halfWidth,

    centerY: y + halfHeight,

    pX: x * 24,

    pY: y * 24,

    x,

    y,

    vX: 0,

    vY: 0
  }
}
