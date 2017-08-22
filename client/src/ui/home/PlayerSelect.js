import React, {Component, PropTypes} from 'react';

export default class PlayerSelect extends Component {
  render() {
    const { selectedPlayerName, players, onSelectPlayer } = this.props;
    const elements = players.map(player => {
      return player.name === selectedPlayerName 
        ? <SelectedPlayer {...player} /> 
        : <Player onClick={onSelectPlayer} {...player} />;
    });
    return (
      <ul id="player-select">
        {elements}
      </ul>
    );
  }
}

class Player extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() { 
    this.props.onClick(this.props.name); 
  }

  render() {
    return (
      <li onClick={this.handleClick}>
        {this.props.name}
      </li>
    );
  }
}

const SelectedPlayer = props => (
  <li style={{border: 'black solid 2px'}}>
    {props.name}
  </li>
);
