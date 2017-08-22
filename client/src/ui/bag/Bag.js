import React, { PropTypes } from 'react';

import './Bag.css';

import { Slot, Item, Table, Row, Cell } from 'ui/common';

const Bag = ({ show, bag, moveItem }) => (!show ? null :
  <div className="bag">
    <Table>
      {bag.map((row, i) => (
        <Row key={i}>
          {row.map((item, j) => (
            <Cell key={j}>
              {item
                ? <Item moveItem={moveItem} {...item} />
                : <Slot accepts={"ITEMS"} />
              }
            </Cell>
          ))}
        </Row>
      ))}
    </Table>
  </div>
);

Bag.defaultProps = {
  bag: [
    [ { name: 'sword' }, { name: 'armor' }, null ],
    [ null, null, null ],
    [ null, null, null ]
  ]
};

  // onEquip(e) {
  //   const itemName = e.target.classList[0].split('-')[1];
  //   this.props.equip(itemName);
  // }

export default Bag;