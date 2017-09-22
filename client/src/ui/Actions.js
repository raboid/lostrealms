import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

import Types from 'shared/types';

import Row from './Row'
import Cell from './Cell'
import Slot from './Slot'
import Item from './Item'

export default class Actions extends PureComponent {
  static propTypes = {
    actions: PropTypes.array.isRequired,
    moveItem: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.renderActionSlots = this.renderActionSlots.bind(this)
  }

  renderActionSlots() {
    const { moveItem, useItem, actions } = this.props;

    const p = {
      accepts: [Types.POTION, Types.KEY],
      source: 'actions'
    }

    const actionSlots = [];

    for(let i=0; i < 5; i++) {
      const action = actions[i];

      p.slot = i;

      actionSlots.push(
        <Cell>
          {action 
            ? <Item {...p} item={action} moveItem={moveItem} useItem={useItem} /> 
            : <Slot {...p} />
          }
        </Cell>
      );
    }

    return actionSlots;
  }

  render() {
    const { actions } = this.props;

    return (
      <div style={{
        flexBasis: 0,
        flexGrow: 1,
        justifyContent: 'center',
        display: 'flex',
      }}>
        <Row>
          {this.renderActionSlots()}
        </Row>
      </div>
    );
  }
}