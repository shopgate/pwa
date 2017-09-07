/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

/**
 * The default button for the Picker component.
 * @returns {JSX} The button component.
 */
const PickerList = ({ items, onClose, onSelect, selectedIndex }) => (
  <ul>
    {items.map((item, currentIndex) =>
      <li
        key={item.value}
        className={classNames({ [styles.active]: currentIndex === selectedIndex })}
      >
        <button
          className={styles.button}
          disabled={item.disabled}
          onClick={() => {
            onSelect(item.value);
            onClose();
          }}
        >
          {item.label}
        </button>
      </li>
    )}
  </ul>
);

PickerList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  selectedIndex: PropTypes.number,
};

PickerList.defaultProps = {
  onClose: () => {},
  selectedIndex: null,
};

export default PickerList;
