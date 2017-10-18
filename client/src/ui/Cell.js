import React, { PureComponent } from "react"
import PropTypes from "prop-types"

export default class Cell extends PureComponent {
  render() {
    return (
      <div
        className="cell"
        style={{
          display: "flex",
          width: "24px",
          height: "24px",
          marginRight: "2px",
          borderRadius: "5px",
          backgroundColor: "#42320F"
        }}
      >
        {this.props.children}
      </div>
    )
  }
}
