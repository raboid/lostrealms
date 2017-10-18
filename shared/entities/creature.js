export default function Creature({ src, x, y }) {
  return {
    type: Type.CREATURE,

    collidable: true,

    src,

    x,

    y
  }
}
