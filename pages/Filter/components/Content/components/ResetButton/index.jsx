import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Button from '@shopgate/pwa-ui-shared/Button';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const FilterResetButton = ({ active, onClick }) => (
  <div className={styles}>
    <Button flat type="primary" onClick={onClick} disabled={!active}>
      <I18n.Text string="filter.reset" />
    </Button>
  </div>
);

FilterResetButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FilterResetButton;
