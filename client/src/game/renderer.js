import * as Pixi from "pixi.js"

const dimensions = {
  width: window.innerWidth,
  height: window.innerHeight
}

export default class Renderer {
  constructor() {
    PIXI.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST
    const { width, height } = dimensions
    this.pixi = new Pixi.WebGLRenderer(width, height, {
      antialias: false,
      transparent: true,
      //roundPixels: true
    })

    window.addEventListener("resize", () => {
      const { width, height } = dimensions
      this.pixi.resize(width, height)
    })

    document.getElementById("game").appendChild(this.pixi.view)
    this.canvasRef = document.getElementsByTagName("canvas")[0]
    this.canvasRef.style.display = "none"

    this.render = this.render.bind(this)
  }

  setup() {
    this.canvasRef.style.display = "block"

    this.stage = new Pixi.Container()

    this.groundLayer = new Pixi.Container()
    this.entityLayer = new Pixi.Container()

    this.stage.addChild(this.groundLayer)
    this.stage.addChild(this.entityLayer)
  }

  getPosition(x, y) {
    return { x: x - this.pixi.width / 2, y: y - this.pixi.height / 2 }
  }

  addSprite(sprite) {
    if(sprite.layer === 'ground') {
      this.groundLayer.addChild(sprite)
    } else {
      this.entityLayer.addChild(sprite);
    }
  }

  removeSprite(sprite) {
    if(sprite.layer === 'ground') {
      this.groundLayer.removeChild(sprite)
    } else {
      this.entityLayer.removeChild(sprite);
    }
  }

  destroy() {
    this.groundLayer = null
    this.entityLayer = null
    this.stage = null

    this.pixi.clear(0)

    this.canvasRef.style.display = "none"

    //document.getElementById('game').removeChild(this.pixi.view)
  }

  sortEntities(a, b) {
    if (a.y > b.y) return 1;
    if (a.y < b.y) return -1;
    if (a.x > b.x) return 1;
    if (a.x < b.x) return -1;
    return 0;
  }

  render({ x, y }) {
    this.stage.pivot.x = x
    this.stage.pivot.y = y

    this.stage.position.x = this.pixi.width / 2
    this.stage.position.y = this.pixi.height / 2

    // Only sort entities layer
    this.entityLayer.children.sort(this.sortEntities) 

    this.pixi.render(this.stage)
  }
}
