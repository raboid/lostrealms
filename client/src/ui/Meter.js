import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

const heartSrc = require('assets/images/heart.png');

export default class Meter extends PureComponent {
  static propTypes = {
    current: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired
  }

  render() {
    const { current, max, type } = this.props;

    const icon = type === 'health' ? <HealthIcon /> : <ManaIcon />

    const currentWidth = (current / max) * 150;

    return (
      <div style={{
        zIndex: 2,
        display: 'flex',
        margin: '5px'
      }}>
        {icon}
        <div style={{
          display: 'flex',
          width: `150px`,
          padding: '2px',
          backgroundColor: 'grey'
        }}>
          <div style={{
            position: 'absolute',
            fontSize: '10px',
            color: 'white',
            left: '85px',
          }}>
            {`${current} /\ ${max}`}
          </div>
          <div style={{
            display: 'flex',
            width: `${currentWidth}px`,
            backgroundColor: type === 'health' ? 'red' : 'blue',

          }} />
        </div>
      </div>
    );
  }
}

const HealthIcon = () => (
  <img className="pixelated heart" src={heartSrc} />
);

const ManaIcon = () => (
  <img className="pixelated heart" src={heartSrc} />
);