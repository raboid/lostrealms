import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

export default class Cell extends PureComponent {
  render() {
    return (
      <div style={{
        display: 'flex',
        marginRight: '3px',
        width: '36px',
        height: '36px',
        backgroundColor: 'gray',
      }}>
        {this.props.children}
      </div>
    );
  }
}