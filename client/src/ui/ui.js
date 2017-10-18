import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { DragDropContext } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"

import { generateId } from "utils"
import Chat from "./Chat"
import Meter from "./Meter"
import Settings from "./Settings"
import Skills from "./Skills"
import Equipment from "./Equipment"
import Inventory from "./Inventory"
import Actions from "./Actions"

//import Welcome from './Welcome'
//import Home from './Home'

@DragDropContext(HTML5Backend)
export default class UI extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired,
    chat: PropTypes.array.isRequired
  }

  static childContextTypes = {
    socket: PropTypes.object
  }

  getChildContext() {
    return { socket: this.props.socket }
  }

  constructor(props) {
    super(props)
    this.toggleShow = this.toggleShow.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.moveItem = this.moveItem.bind(this)
    this.useItem = this.useItem.bind(this)

    this.state = {
      playing: false,

      width: window.innerWidth,

      height: window.innerHeight,

      showChat: false,

      showEquipment: false,

      showSettings: false,

      showSkills: false,

      equipment: this.props.player.equipment,

      actions: this.props.player.actions,

      bags: [],

      bindings: this.props.player.bindings
    }
    ;(this.state.bags = this.getBagStates(this.props.player.bags)),
      window.addEventListener("resize", this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.player) {
      const { equipment, bags, actions, bindings } = nextProps.player

      this.setState({
        bags: this.getBagStates(bags),
        equipment,
        bindings,
        actions
      })
    }
  }

  getBagStates(bags) {
    return bags.map((bag, i) => ({
      ...bag,
      open: this.state.bags[i] ? this.state.bags[i].open : false
    }))
  }

  handleResize() {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  getSlot({ bagSlot, source, slot }) {
    switch (source) {
      case "actions":
        return this.state.actions[slot]
      case "equipment":
        return this.state.equipment[slot]
      case "bags":
        return this.state.bags[bagSlot][slot]
    }
  }

  useItem({ item, bagSlot, source, slot }) {
    if (item.stack && item.stack >= 1) {
      item.stack -= 1
    } else {
      item.used = true
    }

    item.use.payload.id = item.id
    window.LR.Game.addAction(item.use, true)

    if (item.stack === 0 || item.used) {
      item = undefined
    }

    if (source === "actions") {
      this.setState({
        actions: {
          ...this.state.actions,
          [slot]: item
        }
      })
    } else if (source === "equipment") {
      this.setState({
        equipment: {
          ...this.state.equipment,
          [slot]: item
        }
      })
    } else if (source === "bags") {
      this.setState({
        bags: Object.assign([], this.state.bags, {
          [bagSlot]: {
            ...this.state.bags[bagSlot],
            [slot]: item
          }
        })
      })
    }
  }

  moveItem(from, to) {
    const { bags, equipment, actions } = this.state

    const fromSlot = this.getSlot(from)
    const toSlot = this.getSlot(to)

    let newActions, newBags, newEquipment

    if (from.source === "actions") {
      newActions = {
        ...actions,
        [from.slot]: toSlot
      }
    } else if (from.source === "equipment") {
      newEquipment = {
        ...equipment,
        [from.slot]: toSlot
      }
    } else if (from.source === "bags") {
      newBags = Object.assign([], bags, {
        [from.bagSlot]: {
          ...bags[from.bagSlot],
          [from.slot]: toSlot
        }
      })
    }

    if (to.source === "actions") {
      const obj = newActions ? newActions : actions
      newActions = {
        ...obj,
        [to.slot]: fromSlot
      }
    } else if (to.source === "equipment") {
      const obj = newEquipment ? newEquipment : equipment
      newEquipment = {
        ...obj,
        [to.slot]: fromSlot
      }
    } else if (to.source === "bags") {
      const arr = newBags ? newBags : bags
      newBags = Object.assign([], arr, {
        [to.bagSlot]: {
          ...arr[to.bagSlot],
          [to.slot]: fromSlot
        }
      })
    }

    const updates = {
      ...(newEquipment ? { equipment: newEquipment } : {}),
      ...(newActions ? { actions: newActions } : {}),
      ...(newBags ? { bags: newBags } : {})
    }

    this.setState(updates)
  }

  toggleShow(component) {
    const stateKey = `show${component}`

    this.setState({
      [stateKey]: !this.state[stateKey]
    })
  }

  render() {
    const {
      width,
      height,
      showChat,
      showEquipment,
      showSettings,
      showSkills,
      bags,
      equipment,
      actions
    } = this.state

    const { chat, player: { health, mana, maxHealth, maxMana } } = this.props

    return (
      <div
        style={{
          display: "flex",
          width,
          height
        }}
      >
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            flexDirection: "column"
          }}
        >
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                alignSelf: "flex-start",
                padding: "3px",
                borderRadius: "5px",
                backgroundColor: "goldenrod",
                zIndex: 2
              }}
            >
              <Meter current={health} max={maxHealth} type="health" />
              <Meter current={mana} max={maxMana} type="mana" />
            </div>
            <div
              style={{
                backgroundColor: "blue",
                width: "200px",
                height: "40px"
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              display: "flex",
              zIndex: 2,
              border: "5px solid goldenrod",
              backgroundColor: "goldenrod",
              justifyContent: "space-between",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px"
            }}
          >
            <Chat chat={chat} />
            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Actions
                actions={actions}
                moveItem={this.moveItem}
                useItem={this.useItem}
              />
              <div
                style={{
                  display: "flex",
                  marginTop: "5px"
                }}
              >
                <Equipment equipment={equipment} moveItem={this.moveItem} />
                <Inventory
                  inventory={bags[0]}
                  bagSlot={0}
                  moveItem={this.moveItem}
                  useItem={this.useItem}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%"
              }}
            >
              <div>
                <div>Skills</div>
                <div>Settings</div>
              </div>
              <div
                style={{
                  display: "flex"
                }}
              />
              <Skills show={showSkills} />
              <Settings show={showSettings} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
