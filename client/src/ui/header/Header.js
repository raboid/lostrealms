import React, { PropTypes } from 'react';
import Health from './Health';

import './Header.css';

const Header = ({ health }) => (
  <div className="header">
    <Health health={5} />
  </div>
)

export default Header;