import Objects from '../objects'
import Types from '../types'

const x = 100
const y = 100

const width = 24
const height = 24

const halfWidth = width / 2
const halfHeight = height / 2

export default function Player({ name }) {
  return {
    type: "player", //Types.PLAYER

    collidable: true,

    health: 50,

    maxHealth: 100,

    mana: 50,

    maxMana: 100,

    bags: [
        {
            ...Objects['Plain Bag'],
            0: { ...Objects['Small Health Potion'], stack: 74 },
            1: { ...Objects['Silver Ring'] },
            4: { ...Objects['Gold Ring'] },
            6: { ...Objects['Small Mana Potion'], stack: 3 },
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

    name,

    width,

    height,

    halfWidth,

    halfHeight,

    centerX: x + halfWidth,

    centerY: y + halfHeight,

    x,

    y,

    vX: 0,

    vY: 0
  }
}
