import Entity from './entity'
import { bindings } from '../keyboard'
import * as Components from '../components'

export default (props) => {
  let { position: { x, y }, radius, color, renderer } = props
// Initialize the pixi Graphics class
  let graphic = new PIXI.Graphics();
  graphic.lineStyle(8, 0, .7)
  graphic.beginFill(color); // Red
  graphic.drawCircle(radius/2, radius/2, radius);
  graphic.endFill();
  graphic.lineStyle(0, 0, 0)
  graphic.beginFill(0xFFFFFF)
  graphic.drawCircle(radius/2, radius/2, 5)
  graphic.endFill()
  let tex = renderer.generateTexture(graphic);
  let sprite = new PIXI.Sprite(tex);
  sprite.anchor.x = .5;
  sprite.anchor.y = .5;
  sprite.position.x = x;
  sprite.position.y = y;

  return {
    type: 'blob',

    ...props,

    init() {
    },

    update(props) {
      //this.updateAI(props)
      //this.updateVelocity(props)
      //this.updatePosition(props)
      //this.updateSprite(props)
    },

    ...Components.ai({props}),

    ...Components.shoot(props),

    ...Components.sprite({...props, sprite}),
  }
}