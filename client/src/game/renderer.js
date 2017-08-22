import * as Pixi from 'pixi.js';

const dimensions = {
  width: window.innerWidth,
  height: window.innerHeight
};

export default class Renderer {
  constructor() {
    PIXI.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST;
    const { width, height } = dimensions;
    this.pixi = new Pixi.WebGLRenderer(width, height, {
      antialias: false,
      transparent: true,
      roundPixels: true
    });
    document.getElementById('game').appendChild(this.pixi.view);

    window.addEventListener('resize', () => {
      const { width, height } = dimensions;
      this.pixi.resize(width, height);
    });

    this.stage = new Pixi.Container();

    this.render = this.render.bind(this)
  }

  addSprite(sprite) {
    this.stage.addChild(sprite);
  }

  removeSprite(sprite) {
    this.stage.removeChild(sprite)
  }

  render() {
    this.pixi.render(this.stage);
  }
}