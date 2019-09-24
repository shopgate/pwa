import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Button } from '@shopgate/engage/components';
import { withWidgetSettings } from '@shopgate/engage/core';
import styles from './style';

/**
 * The filter apply button component.
 * @returns {JSX}
 */
const FilterApplyButton = ({ active, onClick, widgetSettings }) => {
  const { buttonTextColor, buttonTextColorDisabled } = widgetSettings;
  const buttonColor = active ? buttonTextColor : buttonTextColorDisabled;

  return (
    <div className={styles}>
      <Button
        flat
        type="primary"
        onClick={onClick}
        disabled={!active}
        testId="applyFilterButton"
        aria-hidden={!active}
      >
        <I18n.Text string="filter.apply" style={{ color: buttonColor }} />
      </Button>
    </div>
  );
};

FilterApplyButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  widgetSettings: PropTypes.shape().isRequired,
};

export default withWidgetSettings(FilterApplyButton, '@shopgate/engage/components/AppBar');
