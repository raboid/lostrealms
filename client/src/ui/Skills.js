import React, { PureComponent } from "react"
import PropTypes from "prop-types"

import Types from "shared/types"

import Row from "./Row"
import Cell from "./Cell"
import Slot from "./Slot"
import Table from "./Table"

export default class Skills extends PureComponent {
  render() {
    if (!this.props.show) {
      return null
    }

    return (
      <div
        style={{
          display: "flex",
          marginBottom: "3px"
        }}
      >
        <Table>
          <Row>
            <Cell />
          </Row>
        </Table>
      </div>
    )
  }
}
