import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { I18n, Button, SurroundPortals } from '@shopgate/engage/components';
import { PORTAL_FILTER_APPLY_BUTTON } from '@shopgate/engage/filter/constants';
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
    <SurroundPortals
      portalName={PORTAL_FILTER_APPLY_BUTTON}
      portalProps={{ active, onClick, widgetSettings }}
    >
      <div className={styles.wrapper}>
        <Button
          className={styles.button}
          flat
          type="primary"
          onClick={onClick}
          disabled={!active}
          testId="applyFilterButton"
        >
          <I18n.Text string="filter.apply" style={{ color: buttonColor }} />
        </Button>
      </div>
    </SurroundPortals>
  );
};

FilterApplyButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  widgetSettings: PropTypes.shape().isRequired,
};

export default withWidgetSettings(memo(FilterApplyButton), '@shopgate/engage/components/AppBar');
