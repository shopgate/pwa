import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Button from '@shopgate/pwa-ui-shared/Button';
import connect from './connector';
import styles from './style';

/**
 * The Filter List Clear All Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ClearAllButton = ({ isActive, removeAllTemporaryFilters }) => (
  <div className={styles}>
    <Button
      flat
      type="regular"
      onClick={() => removeAllTemporaryFilters()}
      disabled={!isActive}
    >
      <I18n.Text string="filter.clear_all" />
    </Button>
  </div>
);

ClearAllButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  removeAllTemporaryFilters: PropTypes.func.isRequired,
};

export default connect(ClearAllButton);
