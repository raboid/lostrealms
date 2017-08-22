import Entity from './entity'
import * as Components from '../components'
import Map from '../map'

export default class Item extends Entity {
  constructor(config) {
    super();
    this.sprite = this.createSprite()
  }

  createSprite({ x, y, theme, type }) {
    let id = PIXI.loader.resources['items'].textures;

    let file = "item-" + type + "-" + theme + ".png";
    let sprite = new PIXI.Sprite(id[file]);
    sprite.anchor.x = -0.25;
    sprite.anchor.y = -0.25;
    sprite.position = Map.getPixelCoordinates(x, y);
    return sprite;
  }
}