import * as Pixi from "pixi.js"

const TARGET_WIDTH = 800
const TARGET_HEIGHT = 600

export default class Renderer {
  constructor(onClick) {
    //PIXI.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST

    this.pixi = new Pixi.WebGLRenderer(TARGET_WIDTH, TARGET_HEIGHT, {
      transparent: true,
      roundPixels: true,
      antialiasing: false,
      resolution: window.devicePixelRatio
    })

    this.onClick = onClick

    document.getElementById("game").appendChild(this.pixi.view)

    this.canvasRef = document.getElementsByTagName("canvas")[0]

    this.canvasRef.style.display = "none"

    this.render = this.render.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }

  setup() {
    this.canvasRef.style.display = "block"

    this.stage = new Pixi.Container()

    this.stage.interactive = true

    this.stage.hitArea = new Pixi.Rectangle(0, 0, 800, 600)

    this.stage.on("click", this.handleClick)

    this.groundLayer = new Pixi.Container()
    this.entityLayer = new Pixi.Container()

    this.stage.addChild(this.groundLayer)
    this.stage.addChild(this.entityLayer)

    this.handleResize()

    window.addEventListener("resize", this.handleResize)
    window.addEventListener("deviceOrientation", this.handleResize)

    this.entityLayer.scale.x = 1
    this.entityLayer.scale.y = 1
  }

  handleResize(event) {
    const width = window.innerWidth
    const height = window.innerHeight
    let targetScale

    this.canvasRef.width = width * window.devicePixelRatio
    this.canvasRef.height = height * window.devicePixelRatio
    this.canvasRef.style.width = width + "px"
    this.canvasRef.style.height = height + "px"

    this.pixi.resize(this.canvasRef.width, this.canvasRef.height)

    if (height / TARGET_HEIGHT < width / TARGET_WIDTH) {
      this.stage.scale.x = this.stage.scale.y = height / TARGET_HEIGHT
    } else {
      this.stage.scale.x = this.stage.scale.y = width / TARGET_WIDTH
    }

    this.stage.pivot.y =
      -(width * (1 / this.stage.scale.y) / 2) * window.devicePixelRatio
    this.stage.pivot.x =
      -(width * (1 / this.stage.scale.x) / 2) * window.devicePixelRatio

    /**
     * iOS likes to scroll when rotating - fix that 
     */
    window.scrollTo(0, 0)
  }

  handleClick(event) {
    const pos = event.data.getLocalPosition(this.stage)

    const mX = pos.x - pos.x % 24
    const mY = pos.y - pos.y % 24

    const x = mX / 24
    const y = mY / 24

    const pX = mX + 12
    const pY = mY + 12

    this.onClick({ x, y, pX, pY })
  }

  addSprite(sprite) {
    if (sprite.layer === "ground") {
      this.groundLayer.addChild(sprite)
    } else {
      this.entityLayer.addChild(sprite)
    }
  }

  removeSprite(sprite) {
    if (sprite.layer === "ground") {
      this.groundLayer.removeChild(sprite)
    } else {
      this.entityLayer.removeChild(sprite)
    }
  }

  destroy() {
    this.groundLayer = null
    this.entityLayer = null
    this.stage = null

    this.pixi.clear(0)

    this.canvasRef.style.display = "none"

    window.removeEventListener("resize", this.handleResize)
    //document.getElementById('game').removeChild(this.pixi.view)
  }

  sortEntities(a, b) {
    if (a.y > b.y) return 1
    if (a.y < b.y) return -1
    if (a.x > b.x) return 1
    if (a.x < b.x) return -1
    return 0
  }

  render({ x, y }) {
    // this.stage.pivot.x = x
    // this.stage.pivot.y = y

    // this.stage.position.x = this.pixi.width / 2
    // this.stage.position.y = this.pixi.height / 2

    //this.stage.hitArea.x = x - this.pixi.width / 2
    //this.stage.hitArea.y = y - this.pixi.height / 2

    // Only sort entities layer
    // this.entityLayer.children.sort(this.sortEntities)

    this.pixi.render(this.stage)
  }
}
