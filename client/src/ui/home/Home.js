import React, { Component }           from 'react';
import PlayerSelect                   from './PlayerSelect';
import PlayerCreate                   from './PlayerCreate';
    
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.handleShowCreate   = this.handleShowCreate.bind(this);
    this.handleStart        = this.handleStart.bind(this);
    this.handleSelectPlayer = this.handleSelectPlayer.bind(this);
    this.handleHideCreate   = this.handleHideCreate.bind(this);
    this.state = {
      showCreate: false,
      selectedPlayerName: ''
    };
  }

  handleShowCreate() {
    this.setState({ showCreate: true });
  }

  handleHideCreate() {
    this.setState({ showCreate: false });
  }

  handleSelectPlayer(selectedPlayerName) {
    this.setState({ selectedPlayerName })
  }

  handleStart() {
    const selectedPlayer = this.props.players.find(player => player.name === this.state.selectedPlayerName);
    this.props.start(selectedPlayer);
  }

  renderPlayerCreate() {
    return (
      <div className="container">
        <PlayerCreate onCreatePlayer={this.props.onCreatePlayer} />
        <button type="button" onClick={this.handleHideCreate}>
          Exit
        </button>
      </div>
    );
  }

  renderPlayerSelect() {
    let selection = <div/>;
    if(this.state.selectedPlayerName) {
      selection = this.renderSelection();
    }
    return (
      <div className="container">
        <PlayerSelect
          players            = {[]}
          selectedPlayerName = {this.state.selectedPlayerName}
          onSelectPlayer     = {this.handleSelectPlayer}
          onShowCreate       = {this.handleShowCreate}
        />
        {selection}
        <button type="button" onClick={this.handleShowCreate}>Create Player</button>
      </div>
    );
  }

  renderSelection() {
    return (
      <div id="selection">
        <div>Show character here</div>
        <button type="button" onClick={this.handleStart}>Enter World</button>
      </div>
    );
  }

  render() {
    return this.state.showCreate ? this.renderPlayerCreate() : this.renderPlayerSelect();
  }
}
