import React, {PropTypes} from 'react';

import { Row, Cell, Slot, Item } from 'ui/common';

const Actions = ({ actions }) => (
  <div className="action-bar">
    <Row>
      {actions.map((action, i) => (
        <Cell key={i}>
          {action 
            ? <Item key={i} {...action} /> 
            : <Slot key={i} accepts={"ITEMS"} />
          }
        </Cell>
      ))}
    </Row>
  </div>
)

Actions.defaultProps = { 
  actions: [
    { name: 'sword' },
    { name: 'armor' },
    {},
    {},
    {}
  ]
}

Actions.propTypes = { 
  actions: PropTypes.array
}

export default Actions;

//moveItem={moveItem}