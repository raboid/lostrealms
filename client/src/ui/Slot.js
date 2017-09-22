import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd';

const slotTarget = {
  drop: props => ({ 
    slot: props.slot,
    bagSlot: props.bagSlot,
    source: props.source
  })
};

const collectTarget = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
})

@DropTarget(props => props.accepts, slotTarget, collectTarget)
export default class Slot extends PureComponent {
  static propTypes = {
    onDrop: PropTypes.func.isRequired,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    slot: PropTypes.number.isRequired,
    bagSlot: PropTypes.number,
    source: PropTypes.string.isRequired
  }

  render() {
    const { x, y, connectDropTarget, isOver } = this.props;

    return (
      connectDropTarget(<div style={{ flexGrow: 1 }} />)
    );
  }
}