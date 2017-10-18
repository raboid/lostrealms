import React, { PureComponent } from "react"
import PropTypes from "prop-types"

import { ITEM_TYPES } from "shared/types"

import Row from "./Row"
import Cell from "./Cell"
import Slot from "./Slot"
import Item from "./Item"
import Table from "./Table"

export default class Inventory extends PureComponent {
  static propTypes = {
    inventory: PropTypes.object,
    moveItem: PropTypes.func.isRequired,
    useItem: PropTypes.func.isRequired,
    bagSlot: PropTypes.number.isRequired
  }

  static contextTypes = {
    socket: PropTypes.object
  }

  renderCells(row) {
    const { inventory, moveItem, useItem, bagSlot } = this.props

    const cells = []

    for (let i = 0; i < inventory.width; i++) {
      const slot = row * inventory.width + i
      const item = inventory[slot]
      const p = {
        slot,
        bagSlot,
        accepts: [...ITEM_TYPES],
        source: "bags"
      }

      cells.push(
        <Cell>
          {item ? (
            <Item {...p} item={item} moveItem={moveItem} useItem={useItem} />
          ) : (
            <Slot {...p} />
          )}
        </Cell>
      )
    }

    return cells
  }

  renderRows() {
    const rows = []

    for (let row = 0; row < this.props.inventory.height; row++) {
      rows.push(<Row>{this.renderCells(row)}</Row>)
    }

    return rows
  }

  render() {
    const { inventory } = this.props

    return (
      <div
        style={{
          zIndex: 2,
          display: "flex"
        }}
      >
        <Table>{this.renderRows()}</Table>
      </div>
    )
  }
}
