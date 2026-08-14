import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { I18n, Button, SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { PORTAL_FILTER_APPLY_BUTTON } from '@shopgate/engage/filter/constants';
import { withWidgetSettings } from '@shopgate/engage/core';

const useStyles = makeStyles()({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    height: 44,
  },
  button: {
    padding: '0 !important',
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
          className={classes.button}
          flat
          type="regular"
          onClick={onClick}
          disabled={disabled}
          testId="applyFilterButton"
        >
          <I18n.Text string="common.apply" />
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
