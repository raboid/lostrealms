import React, { PureComponent } from "react"
import PropTypes from "prop-types"

export default class Texture extends PureComponent {
  computeStyles() {
    const texture = PIXI.loader.resources["sheet"].textures[this.props.src]

    const textureSrc = texture.baseTexture.source.src

    const { x, y, width, height } = texture.orig

    return {
      backgroundImage: `url(${textureSrc})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: `-${x}px -${y}px`,
      width,
      height
    }
  }

  render() {
    return <div style={this.computeStyles()} />
  }
}
