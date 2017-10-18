import React, { PureComponent } from "react"
import PropTypes from "prop-types"

const heartSrc = require("assets/images/heart.png")

export default class Meter extends PureComponent {
  static propTypes = {
    current: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired
  }

  render() {
    const { current, max, type } = this.props

    const isHealth = type === "health"

    const icon = isHealth ? <HealthIcon /> : <ManaIcon />

    const currentWidth = current / max * 150

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: isHealth ? "2px" : 0
        }}
      >
        {icon}
        <div
          style={{
            display: "flex",
            width: `150px`,
            borderRadius: "5px",
            border: `1px solid ${isHealth ? "darkred" : "darkgreen"}`,
            alignItems: "center"
          }}
        >
          <div
            style={{
              position: "absolute",
              fontSize: "10px",
              color: "white",
              left: "85px"
            }}
          >
            {`${current} /\ ${max}`}
          </div>
          <div
            style={{
              display: "flex",
              width: `${currentWidth}px`,
              height: "14px",
              borderTopLeftRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderTopRightRadius: current === max ? "4px" : 0,
              borderBottomRightRadius: current === max ? "4px" : 0,
              backgroundColor: isHealth ? "red" : "green"
            }}
          />
        </div>
      </div>
    )
  }
}

const HealthIcon = () => (
  <img
    className="pixelated heart"
    src={heartSrc}
    style={{ height: "16px", width: "16px", marginRight: "5px" }}
  />
)

const ManaIcon = () => (
  <img
    className="pixelated heart"
    src={heartSrc}
    style={{ height: "16px", width: "16px", marginRight: "5px" }}
  />
)
