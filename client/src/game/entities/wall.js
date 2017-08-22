import Entity from './entity'
import * as Components from '../components'
import Map from '../map'

// @Components.collision({
//     any: (other) => {}
// })
@Components.sprite
export default class Wall extends Entity {
  constructor(config) {
    super();
    this.sprite = this.createSprite(config)
  }

  createSprite({map, x, y, theme}) {
    let id = PIXI.loader.resources['world'].textures;
    let weight = 0;
    if (map.checkNeighborWest(x, y)) {
      weight += 1;
    }
    if (map.checkNeighborNorth(x, y)) {
      weight += 2;
    }
    if (map.checkNeighborEast(x, y)) {
      weight += 4;
    }
    if (map.checkNeighborSouth(x, y)) {
      weight += 8;
    }
    let file = "world-wall-" + theme + "-" + weightToWallSprite(weight) + ".png";
    let sprite = new PIXI.Sprite(id[file]);
    sprite.position = Map.getPixelCoordinates(x, y);
    return sprite;
  } 
}
