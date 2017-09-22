import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { generateId } from 'utils';
import Chat from './Chat'
import Header from './Header'
import Footer from './Footer'
import Menu from './Menu'
import Equipment from './Equipment'
import Inventory from './Inventory'
//import Welcome from './Welcome'
//import Home from './Home'

@DragDropContext(HTML5Backend)
export default class UI extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired,
    chat: PropTypes.array.isRequired,
  };

  static childContextTypes = {
    socket: PropTypes.object
  };

  getChildContext() {
    return { socket: this.props.socket };
  }

  constructor(props) {
    super(props)
    this.toggleShow = this.toggleShow.bind(this);
    this.handleResize = this.handleResize.bind(this)
    this.toggleShowBag = this.toggleShowBag.bind(this)
    this.renderBag = this.renderBag.bind(this)
    this.moveItem = this.moveItem.bind(this)
    this.useItem = this.useItem.bind(this)

    this.state = {
      playing: false,

      width: window.innerWidth,

      height: window.innerHeight,

      showChat: false,

      showEquipment: false,

      showMenu: false,

      equipment: this.props.player.equipment,

      bags: this.props.player.bags.map(bag => ({ ...bag, open: false })),

      actions: this.props.player.actions,

      bindings: this.props.player.bindings
    }

    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  getSlot({ bagSlot, source, slot }) {
    switch(source) {
      case 'actions': return this.state.actions[slot]
      case 'equipment': return this.state.equipment[slot]
      case 'bags': return this.state.bags[bagSlot][slot]
    }
  }

  useItem({ item, bagSlot, source, slot }) {
    if(item.stack && item.stack > 1) {
      item.stack -= 1
    } else {
      item = undefined;
      //item.used = true;
    }

    if(source === 'actions') {
      this.setState({ actions: {
        ...this.state.actions,
        [slot]: item
      }})
    } else if(source === 'equipment') {
      this.setState({ equipment: {
        ...this.state.equipment,
        [slot]: item
      }})
    } else if(source === 'bags') {
      this.setState({ 
        bags: Object.assign([], this.state.bags, { 
          [bagSlot]: { 
            ...this.state.bags[bagSlot], 
            [slot]: item
          } 
        }) 
      })
    }

    item.use.payload.id = item.id
    window.LR.Game.addAction(item.use, true);
  }

  moveItem(from, to) {
    const { bags, equipment, actions } = this.state;

    const fromSlot = this.getSlot(from)
    const toSlot = this.getSlot(to)

    let newActions, newBags, newEquipment;

    if(from.source === 'actions') {
      newActions = {
        ...actions,
        [from.slot]: toSlot
      }
    } else if(from.source === 'equipment') {
      newEquipment = {
        ...equipment,
        [from.slot]: toSlot
      }
    } else if(from.source === 'bags') {
      newBags = Object.assign([], bags, { 
        [from.bagSlot]: { 
          ...bags[from.bagSlot], 
          [from.slot]: toSlot
        } 
      }) 
    }

    if(to.source === 'actions') {
      const obj = newActions ? newActions : actions;
      newActions = {
        ...obj,
        [to.slot]: fromSlot
      }
    } else if(to.source === 'equipment') {
      const obj = newEquipment ? newEquipment : equipment;
      newEquipment = {
        ...obj,
        [to.slot]: fromSlot
      }
    } else if(to.source === 'bags') {
      const arr = newBags ? newBags : bags;
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
    const stateKey = `show${component}`;

    this.setState({ 
      [stateKey]: !this.state[stateKey]
    });
  }

  toggleShowBag(bag) {
    const { bags } = this.state;
    const index = bags.findIndex(({ name }) => name === bag.name);

    this.setState({ bags: Object.assign([], bags, { [index]: { ...bag, open: !bag.open } }) });
  }

  renderBag(bag, i) {
    if(bag.open) {
      return (
        <Inventory inventory={bag} bagSlot={i} moveItem={this.moveItem} useItem={this.useItem} />
      )
    }

    return null;
  }

  render() {
    const { width, height, showChat, showEquipment, bags, equipment, actions } = this.state;

    const { chat, player } = this.props;

    return (
      <div style={{ 
        display: 'flex', 
        width, 
        height 
      }}>
        <div style={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
        }}>
          <Header player={player} />
          <div style={{
            position: 'absolute',
            bottom: '48px',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>
            <Chat show={showChat} chat={chat} />
            <div style={{
              cursor: 'pointer',
              display:  'flex',
              marginLeft: 'auto',
            }}>
              {bags.map(this.renderBag)}
              <Equipment show={showEquipment} equipment={equipment} moveItem={this.moveItem} />
            </div>
          </div>
          <Footer 
            toggleShow={this.toggleShow} 
            toggleShowBag={this.toggleShowBag} 
            bags={bags} 
            actions={actions}
            moveItem={this.moveItem}
            useItem={this.useItem}
          />
        </div>
      </div> 
    );
  }
};