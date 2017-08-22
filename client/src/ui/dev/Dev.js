import React, { Component } from 'react';

export default class Dev extends Component {
  componentDidMount() {
    document.getElementById('render-stats').appendChild(this.props.render);
    document.getElementById('game-stats').appendChild(this.props.game);
  }

  render() {
    return (
      <div id="devtools">
        <h1>Dev Tools</h1>
        <div id='render-stats'>
          <h2>Render</h2>
        </div>
        <div id='game-stats'>
          <h2>Game</h2>
        </div>
      </div>
    );
  }
};
