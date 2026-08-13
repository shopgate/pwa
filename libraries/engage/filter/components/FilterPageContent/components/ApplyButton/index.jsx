import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import { PORTAL_FILTER_APPLY_BUTTON } from '@shopgate/engage/filter/constants';
import { withWidgetSettings } from '@shopgate/engage/core';

const useStyles = makeStyles()({
  wrapper: {
    display: 'flex',
    marginRight: 4,
  },
  button: {
    padding: 0,
  },
});

/**
 * The filter apply button component.
 * @param {Object} props The component props
 * @param {boolean} props.disabled Whether the button is disabled
 * @param {Function} props.onClick Click handler for the button
 * @returns {JSX.Element}
 */
const FilterApplyButton = ({ disabled, onClick, widgetSettings }) => {
  const { classes } = useStyles();
  const { buttonTextColor, buttonTextColorDisabled } = widgetSettings;
  const buttonColor = !disabled ? buttonTextColor : buttonTextColorDisabled;

  return (
    <SurroundPortals
      portalName={PORTAL_FILTER_APPLY_BUTTON}
      portalProps={{
        disabled,
        onClick,
        widgetSettings,
      }}
    >
      <div className={classes.wrapper}>
        <Button
          variant="text"
          color="secondary"
          className={classes.button}
          onClick={onClick}
          disabled={disabled}
          testId="applyFilterButton"
        >
          <I18n.Text string="filter.apply" style={{ color: buttonColor }} />
        </Button>
      </div>
    </SurroundPortals>
  );
};

FilterApplyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  widgetSettings: PropTypes.shape().isRequired,
  disabled: PropTypes.bool,
};

FilterApplyButton.defaultProps = {
  disabled: false,
};

export default withWidgetSettings(memo(FilterApplyButton), '@shopgate/engage/components/AppBar');
