import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

export default class Table extends PureComponent {
  render() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        {this.props.children}
      </div>
    );
  }
}