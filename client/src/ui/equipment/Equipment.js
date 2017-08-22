import React, { PropTypes } from 'react';

import './Equipment.css';

import { Slot, Item, Table, Row, Cell } from 'ui/common';

const getClassName = (item) => { return `item-${item.name}`; }

const Equipment = ({ show, equipment, position }) => (!show ? null :
  <div className="equipment">
    <Table>
      <Row>
        <Cell><Slot accepts={"WEAPON"} slot={20} /></Cell>
        <Cell><Slot accepts={"WEAPON"} slot={30} /></Cell>
        <Cell><Slot accepts={"ARMOR"} slot={40} /></Cell>
      </Row>
    </Table>
  </div>
);

Equipment.propTypes = {
  equipment: PropTypes.object,
  position: PropTypes.object
};

export default Equipment;

    /*this.state = {
      slots: [
        { accepts: [ItemTypes.HEAD], lastDroppedItem: null },
        { accepts: [ItemTypes.CHEST], lastDroppedItem: null },
        { accepts: [ItemTypes.LEGS], lastDroppedItem: null },
        { accepts: [ItemTypes.SWORD, ItemTypes.BOW, ItemTypes.WAND], lastDroppedItem: null },
        { accepts: [ItemTypes.SHIELD], lastDroppedItem: null}
      ]
    }*/
