import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Types from 'shared/types';

import Row from './Row'
import Cell from './Cell'
import Slot from './Slot'
import Item from './Item'
import Table from './Table'

export default class Equipment extends PureComponent {
  static propTypes = {
    equipment: PropTypes.object.isRequired,
    moveItem: PropTypes.func.isRequired
  };

  renderItemOrSlot(accepts, slot) {
    const { moveItem, equipment } = this.props;

    const item = equipment[slot];

    const p = {
      slot,
      accepts,
      source: 'equipment'
    }

    return item ? <Item {...p} moveItem={moveItem} item={item} /> : <Slot {...p} />;
  }

  render() {
    const { show, equipment } = this.props;

    if(!show) {
      return null;
    }

    return (
      <div style={{
        display: 'flex',
        backgroundColor: 'white',
        zIndex: 2,
      }}>
        <Table>
          <Row>
            <Cell>
              {this.renderItemOrSlot([Types.CAPE], 0)}
            </Cell>
            <Cell>
              {this.renderItemOrSlot([Types.HELMET], 1)}
            </Cell>
            <Cell>
              {this.renderItemOrSlot([Types.NECKLACE], 2)}
            </Cell>
          </Row>
          <Row>
            <Cell>
              {this.renderItemOrSlot([Types.SWORD, Types.SHIELD], 3)}
            </Cell>
            <Cell>
              {this.renderItemOrSlot([Types.BREASTPLATE], 4)}
              </Cell>
            <Cell>
              {this.renderItemOrSlot([Types.SWORD, Types.SHIELD], 5)}
            </Cell>
          </Row>
          <Row>
            <Cell>
              {this.renderItemOrSlot([Types.BELT], 6)}
            </Cell>
            <Cell>
              {this.renderItemOrSlot([Types.GREAVES], 7)}
            </Cell>
            <Cell>
              {this.renderItemOrSlot([Types.RING], 8)}
            </Cell>
          </Row>
          <Row>
            <Cell>
              {this.renderItemOrSlot([Types.GLOVES], 9)}
            </Cell>
            <Cell>
              {this.renderItemOrSlot([Types.BOOTS], 10)}
            </Cell>
            <Cell>
              {this.renderItemOrSlot([Types.RING], 11)}
            </Cell>
          </Row>
        </Table>
      </div>
    )
  }
}