import React, { PropTypes } from 'react';
import Actions from './Actions';

import './Footer.css';

const Footer = ({ toggleShow }) => (
  <div className="footer">
    <div className="flex-grow footer-left">
      <button type="button" onClick={() => toggleShow('chat')}>Chat</button>
    </div>
    <Actions actions={[{}, {}, {}, {}, {}]} />
    <div className="flex-grow footer-right">
      <button type="button" onClick={() => toggleShow('bag')}>Bag</button>
      <button type="button" onClick={() => toggleShow('equipment')}>Equipment</button>
    </div>
  </div>
);

export default Footer;