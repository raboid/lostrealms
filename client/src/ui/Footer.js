import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'

import Actions from './Actions';

export default class Footer extends PureComponent {
  static propTypes = {
    toggleShow: PropTypes.func.isRequired,
    closeBag: PropTypes.func.isRequired,
    openBag: PropTypes.func.isRequired,
    bags: PropTypes.arrayOf(PropTypes.object).isRequired,
    actions: PropTypes.object.isRequired,
    moveItem: PropTypes.func.isRequired,
    useItem: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.renderBag = this.renderBag.bind(this)
  }

  renderBag(bag) {
    return (
      <button type="button" onClick={() => this.props.toggleShowBag(bag)}>
        {bag.name}
      </button>
    )
  }

  render() {
    const { toggleShow, closeBag, openBag, bags, actions, moveItem, useItem } = this.props;

    return (
      <div style={{
        cursor: 'pointer',
        height: '48px',
        width:  '100%',
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        zIndex: 2,
        backgroundColor: 'darkgray',
      }}>
        <div style={{
          flexBasis: 0,
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'flex-start',
        }}>
          <button style={{ height: '48px', border: 'none' }} type="button" onClick={() => toggleShow('Chat')}>
            Chat
          </button>
        </div>
        <Actions actions={actions} moveItem={moveItem} useItem={useItem} />
        <div style={{
          flexBasis: 0,
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'flex-end',
        }}>
          {bags.map(this.renderBag)}
          <button style={{ height: '48px', border: 'none' }} type="button" onClick={() => toggleShow('Equipment')}>
            Equipment
          </button>
        </div>
      </div>
    );
  }
}