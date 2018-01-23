/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Ripple from 'Components/Ripple';
import { GRID_VIEW, LIST_VIEW } from 'Pages/Category/constants';
import GridIcon from 'Components/icons/GridIcon';
import ListIcon from 'Components/icons/ListIcon';
import connect from './connector';
import styles from './style';

/**
 * The category list component.
 * @param {Array} categories The categories to display.
 * @returns {JSX}
 */
const ViewSwitch = ({ toggleViewMode, viewMode }) => (
  <button
    className={styles.button}
    onClick={() => toggleViewMode(viewMode === GRID_VIEW ? LIST_VIEW : GRID_VIEW)}
  >
    <Ripple className={styles.ripple} overflow>
      {viewMode === GRID_VIEW &&
        <ListIcon />
      }
      {viewMode === LIST_VIEW &&
        <GridIcon />
      }
    </Ripple>
  </button>
);

ViewSwitch.propTypes = {
  toggleViewMode: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf([GRID_VIEW, LIST_VIEW]).isRequired,
};

export default connect(ViewSwitch);
