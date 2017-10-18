import React, { PureComponent } from "react"
import PropTypes from "prop-types"

export default class Row extends PureComponent {
  render() {
    return (
      <div
        className="row"
        style={{
          display: "flex",
          marginBottom: "2px"
        }}
      >
        {this.props.children}
      </div>
    )
  }
}
