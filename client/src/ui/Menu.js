import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

export default class Menu extends PureComponent {
  constructor(props) {
    super(props);

    this.handleSettings = this.handleSettings.bind(this);
    this.handleMain = this.handleMain.bind(this);
    this.handleExit = this.handleExit.bind(this);

    this.state = {
      active: 'MAIN'
    }
  }

  handleSettings() {
    this.setState({active: 'SETTINGS'});
  }

  handleMain() {
    this.setState({active: 'MAIN'});
  }

  handleExit() {
    this.props.hideMenu();
  }

  render() {
    let active = null;
    if(this.state.active === 'MAIN') {
      active = (<Main
        onSettings={this.handleSettings}
        onLogout={this.handleLogout}
        onExit={this.handleExit} />
      );
    } else if(this.state.active === 'SETTINGS') {
      active = (<Settings
        onMain={this.handleMain} />
      );
    }
    return (
      <div className="menu">
        {active}
      </div>
    );
  }
}

const Main = props => (
  <div className="main">
    <button onClick={props.onSettings}>Settings</button>
    <button onClick={props.onLogout}>Log Out</button>
    <button onClick={props.onExit}>Exit</button>
  </div>
);

const Settings = props => (
  <div className="settings">
    <button onClick={props.onMain}>Main</button>
  </div>
)
