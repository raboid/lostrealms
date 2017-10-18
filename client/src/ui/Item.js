import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { DragSource, DropTarget } from "react-dnd"

import Texture from "./Texture"

const getData = props => ({
  slot: props.slot,
  bagSlot: props.bagSlot,
  source: props.source
})

const itemSource = {
  beginDrag: props => ({}),

  endDrag: (props, monitor, component) => {
    const dropResult = monitor.getDropResult()
    if (dropResult) {
      props.moveItem(getData(props), dropResult)
    }
  }
}

const itemTarget = {
  drop: getData
}

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
})

const collectTarget = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
})

@DragSource(props => props.item.type, itemSource, collectSource)
@DropTarget(props => props.accepts, itemTarget, collectTarget)
export default class Item extends PureComponent {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired,

    useItem: PropTypes.func,
    moveItem: PropTypes.func,
    slot: PropTypes.number.isRequired,
    bagSlot: PropTypes.number,
    item: PropTypes.object.isRequired,
    source: PropTypes.string.isRequired,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  state = { showItemDetails: false }

  constructor(props) {
    super(props)
    this.onItemClick = this.onItemClick.bind(this)
    this.showItemDetails = this.showItemDetails.bind(this)
    this.hideItemDetails = this.hideItemDetails.bind(this)
  }

  onItemClick(event) {
    const { item, useItem, source, slot, bagSlot } = this.props
    useItem({ item, source, slot, bagSlot })
  }

  showItemDetails() {
    this.setState({ showItemDetails: true })
  }

  hideItemDetails() {
    this.setState({ showItemDetails: false })
  }

  render() {
    const {
      connectDragSource,
      connectDropTarget,
      isDragging,
      item
    } = this.props

    return connectDropTarget(
      <div
        onClick={this.onItemClick}
        style={{
          opacity: isDragging ? 0 : 1,
          display: "flex",
          flexGrow: 1,
          position: "relative"
        }}
      >
        {connectDragSource(
          <div
            style={{
              display: "flex",
              opacity: isDragging ? 0 : 1,
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1
            }}
            onMouseEnter={this.showItemDetails}
            onMouseLeave={this.hideItemDetails}
          >
            <Texture src={item.src} />
          </div>
        )}
        <Details item={item} show={this.state.showItemDetails} />
        <Stack stack={item.stack} />
      </div>
    )
  }
}

const Details = ({ item: { name }, show }) => {
  if (!show) {
    return null
  }

  return (
    <div
      style={{
        position: "absolute",
        color: "white",
        fontSize: "8px",
        top: "-76px",
        right: "20px",
        width: "80px",
        height: "80px",
        textAlign: "center",
        backgroundColor: "grey",
        zIndex: 3
      }}
    >
      {name}
    </div>
  )
}

const Stack = ({ stack }) => {
  if (stack === 1) {
    return null
  }

  return (
    <div
      style={{
        position: "absolute",
        right: "0",
        bottom: "0",
        color: "white",
        fontSize: "10px"
      }}
    >
      {stack}
    </div>
  )
}
