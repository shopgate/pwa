/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import compose from 'lodash/fp/compose';
import Glow from 'Components/Glow';
import styles from './style';

/**
 * A delay in ms after that the closeMenu callback gets triggered.
 * @type {number}
 */
const CLOSE_DELAY = 250;

/**
 * The Context Menu Item component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Item = ({ children, closeMenu, onClick }) => {
  const handleClick = compose(
    onClick,
    () => setTimeout(closeMenu, CLOSE_DELAY)
  );

  return (
    <Glow>
      <div className={styles.item} onClick={handleClick} aria-hidden>
        {children}
      </div>
    </Glow>
  );
};

Item.propTypes = {
  children: PropTypes.node,
  closeMenu: PropTypes.func,
  onClick: PropTypes.func,
};

Item.defaultProps = {
  children: null,
  closeMenu: () => {},
  onClick: () => {},
};

export default Item;
