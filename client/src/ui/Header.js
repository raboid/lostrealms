import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

import Meter from './Meter'

export default class Header extends PureComponent {
  static propTypes = {
    player: PropTypes.object.isRequired
  }

  render() {
    const { player: { health, maxHealth, mana, maxMana } } = this.props;

    return (
      <div style={{
        display: 'flex',
        flexShrink: 0,
        height: '60px',
        flexDirection: 'column'
      }}>
        <Meter current={health} max={maxHealth} type="health" />
        <Meter current={mana} max={maxMana} type="mana" />
      </div>
    );
  }
}