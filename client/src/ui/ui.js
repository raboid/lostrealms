import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { generateId } from 'utils';
import { Welcome, Home, Chat, Header, Footer, Menu, Equipment, Bag } from 'ui';

import './ui.css';
import './common/common.css';

@DragDropContext(HTML5Backend)
export default class UI extends Component {
  static propTypes = {
    user: PropTypes.object,
    chat: PropTypes.array.isRequired
  };

  static childContextTypes = {
    socket: PropTypes.object
  };

  state = {
    playing: false,

    width: window.innerWidth,

    height: window.innerHeight,

    chat: {
      show: false
    },

    bag: {
      show: false
    },

    equipment: {
      show: false
    },

    menu: {
      show: false
    }
  }

  constructor({ socket }) {
    super()
    this.socket = socket;
    this.toggleShow = this.toggleShow.bind(this);

    window.addEventListener('resize', () => {
      this.setState({ width: window.innerWidth, height: window.innerHeight })
    })
  }

  getChildContext() {
    return { socket: this.socket };
  }

  toggleShow(comp) {
    this.setState({ 
      [comp]: { 
        ...this.state[comp], 
        show: !this.state[comp].show
      }
    });
  }

  render() {
    return (
      <div className="container ui" style={{ width: this.state.width, height: this.state.height}}>
        <div className="ui-container">
          <Header />
          <div className="ui-bottom">
            <Chat show={this.state.chat.show} chat={this.props.chat} />
            <div className="inventory">
              <Equipment show={this.state.equipment.show} />
              <Bag show={this.state.bag.show} />
            </div>
          </div>
          <Footer toggleShow={this.toggleShow} />
        </div>
      </div> 
    );
  }
};