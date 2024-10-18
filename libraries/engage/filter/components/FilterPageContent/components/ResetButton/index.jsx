import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { I18n, Button, SurroundPortals } from '@shopgate/engage/components';
import { PORTAL_FILTER_RESET_BUTTON } from '@shopgate/engage/filter/constants';
import styles from './style';

/**
 * The filter reset button component.
 * @param {Object} props The component props.
 * @param {boolean} props.disabled Whether the button is disabled
 * @param {Function} props.onClick Click handler for the button
 * @returns {JSX}
 */
const FilterResetButton = ({ disabled, onClick }) => (
  <SurroundPortals
    portalName={PORTAL_FILTER_RESET_BUTTON}
    portalProps={{ disabled, onClick }}
  >
    <div className={styles}>
      <Button
        flat
        type="primary"
        onClick={onClick}
        disabled={disabled}
        testId="clearAllButton"
      >
        <I18n.Text string="filter.reset" />
      </Button>
    </div>
  </SurroundPortals>
);

FilterResetButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

FilterResetButton.defaultProps = {
  disabled: false,
};

export default memo(FilterResetButton);
