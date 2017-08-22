import React, { PropTypes } from 'react'
import { DragSource, DropTarget } from 'react-dnd'

import './Item.css'

const itemSource = {
  beginDrag(props) { 
    return {}; 
  },
  endDrag(props, monitor, component) {
    var dropResult = monitor.getDropResult();
    props.moveItem(props.slot, dropResult.slot);
  }
};

const itemTarget = {
  drop(props) { 
    return { 
      slot: props.slot
    }; 
  }
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const collectTarget = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});

  
const getClassName = (name) => { return `item-${name}`; }

const Item = ({ connectDragSource, connectDropTarget, isDragging, name }) => (
  connectDragSource(connectDropTarget(
    <div
      className={`item ${getClassName(name)}`}
      style={{opacity: isDragging ? 0.5 : 1}}
    />
  ))
);

Item.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  slot: PropTypes.number.isRequired
};

export default DropTarget('ITEMS', itemTarget, collectTarget)(DragSource('ITEMS', itemSource, collectSource)(Item));