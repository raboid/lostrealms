import Entity from './entity'
import { rand } from 'utils'
import * as Components from '../components'
import Map from '../map'

@Components.sprite
export default class Ground extends Entity {
  constructor(config) {
    super();
    this.sprite = this.createSprite(config)
  }

  createSprite({x, y, theme}) {
    let id = PIXI.loader.resources['world'].textures;
    let file = "world-ground-" + theme + "-" + rand(1, 3) + ".png";
    let sprite = new PIXI.Sprite(id[file]);
    sprite.position = Map.getPixelCoordinates(x,y);
    return sprite;
  }
}
