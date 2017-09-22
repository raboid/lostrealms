import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

export default class Row extends PureComponent {
  render() {
    return (
      <div style={{
        display: 'flex',
        marginBottom: '3px'
      }}>
        {this.props.children}
      </div>
    );
  }
}
