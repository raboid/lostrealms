import React, { PureComponent } from "react"
import PropTypes from "prop-types"

import Actions from "./Actions"
import Texture from "./Texture"

export default class Footer extends PureComponent {
  static propTypes = {
    toggleShow: PropTypes.func.isRequired,
    bags: PropTypes.arrayOf(PropTypes.object).isRequired,
    actions: PropTypes.object.isRequired,
    moveItem: PropTypes.func.isRequired,
    useItem: PropTypes.func.isRequired,
    showChat: PropTypes.bool.isRequired,
    showSkills: PropTypes.bool.isRequired,
    showSettings: PropTypes.bool.isRequired,
    showSkills: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.renderBag = this.renderBag.bind(this)
  }

  renderBag(bag) {
    const { toggleShowBag } = this.props

    return (
      <Button
        src={bag.src}
        active={bag.open}
        onClick={() => toggleShowBag(bag)}
      />
    )
  }

  render() {
    const {
      toggleShow,
      bags,
      actions,
      moveItem,
      useItem,
      showChat,
      showSettings,
      showEquipment,
      showSkills
    } = this.props

    return (
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          flexShrink: 0,
          alignItems: "center",
          zIndex: 2
        }}
      >
        <Button
          active={showSkills}
          src="item-potion-health-1.png"
          onClick={() => toggleShow("Skills")}
        />
        <Actions actions={actions} moveItem={moveItem} useItem={useItem} />
        <Button
          active={showSettings}
          src="item-potion-health-1.png"
          onClick={() => toggleShow("Settings")}
        />
      </div>
    )
  }
}
//'rgba(218, 165, 32, .7)'
const Button = ({ active, onClick, src }) => (
  <div
    style={{
      borderRadius: "50%",
      padding: "5px",
      margin: "0 5px",
      backgroundColor: active ? "#987324" : "goldenrod"
    }}
    onClick={onClick}
  >
    <Texture src={src} />
  </div>
)
