import React, { PureComponent } from "react"
import PropTypes from "prop-types"

export default class Settings extends PureComponent {
  static propTypes = {
    show: PropTypes.bool.isRequired
  }

  state = {}

  render() {
    if (!this.props.show) {
      return null
    }

    return (
      <div
        style={{
          zIndex: 3,
          backgroundColor: "grey",
          width: "200px",
          height: "250px",
          display: "flex",
          flexDirection: "column"
        }}
      />
    )
  }
}
