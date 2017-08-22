import React, { PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

const slotTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem())
  }
};

const collectTarget = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
})

const Slot = ({x, y, connectDropTarget, isOver}) => (
  connectDropTarget(<div className="slot" />)
);

Slot.propTypes = {
  onDrop: PropTypes.func.isRequired,
}

export default DropTarget(props => props.accepts, slotTarget, collectTarget)(Slot)