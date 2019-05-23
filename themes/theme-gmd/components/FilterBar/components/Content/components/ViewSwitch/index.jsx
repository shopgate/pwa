import React from 'react';
import PropTypes from 'prop-types';
import { Ripple, GridIcon, ListIcon } from '@shopgate/engage/components';
import connect from './connector';
import { GRID_VIEW, LIST_VIEW } from './constants';
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
    data-test-id="viewSwitch"
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
