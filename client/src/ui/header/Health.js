import React, {Component, PropTypes} from 'react';

const heartSrc = require('assets/images/heart.png');

const Health = ({ health }) => (
  <div className="health container">
    {health}
  </div>
);

Health.propTypes = { health: PropTypes.number };

export default Health;

const Heart = () => (
  <img className="pixelated heart" src={heartSrc} />
);