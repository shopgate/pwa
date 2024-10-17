import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { I18n, Button, SurroundPortals } from '@shopgate/engage/components';
import { PORTAL_FILTER_RESET_BUTTON } from '@shopgate/engage/filter/constants';
import styles from './style';

/**
 * The filter reset button component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FilterResetButton = ({ active, onClick }) => (
  <SurroundPortals
    portalName={PORTAL_FILTER_RESET_BUTTON}
    portalProps={{ active, onClick }}
  >
    <div className={styles}>
      <Button
        flat
        type="primary"
        onClick={onClick}
        disabled={!active}
        testId="clearAllButton"
      >
        <I18n.Text string="filter.reset" />
      </Button>
    </div>
  </SurroundPortals>
);

FilterResetButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default memo(FilterResetButton);
