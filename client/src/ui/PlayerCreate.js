import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

export default class PlayerCreate extends PureComponent {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate(event) {
    event.preventDefault();
    this.props.onCreatePlayer({ 
      name: this.refs.name.value.trim() 
    });
  }

  render() {
    return (
      <form id="player-create" onSubmit={this.handleCreate}>
        <input type='text' ref='name' className="form-control" placeholder='Name' />
        <button type="submit">Create</button>
      </form>
    );
  }
}
