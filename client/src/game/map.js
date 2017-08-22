import { rand } from 'utils';
import TYPES from './types';

const TILE_SIZE = 24;

export default class Map {
  constructor(data) {
    this.map = JSON.parse(data)
  }

  checkNeighborWest(row, col) {
    if (col === 0) {
      return false;
    }
    let neighbor = this.map[row][col - 1];
    return neighbor === 1;
  }

  checkNeighborNorth(row, col) {
    if (row === 0) {
      return false;
    }
    let neighbor = this.map[row - 1][col];
    return neighbor === 1;
  }

  checkNeighborEast(row, col) {
    if (col === this.map[0].length - 1) {
      return false;
    }
    let neighbor = this.map[row][col + 1];
    return neighbor === 1;
  }

  checkNeighborSouth(row, col) {
    if (row === this.map.length - 1) {
      return false;
    }
    let neighbor = this.map[row + 1][col];
    return neighbor === 1;
  }

  static getPixelCoordinates(tileCoordinates) {
    return { x: TILE_SIZE * tileCoordinates.x , y: TILE_SIZE * tileCoordinates.y };
  }
}