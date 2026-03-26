import React from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n, SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { PRODUCT_FULFILLMENT_CHANGE_LOCATION } from '../../constants/Portals';

const useStyles = makeStyles()(theme => ({
  button: {
    fontSize: '0.625rem !important',
    letterSpacing: '0.05em',
    padding: [theme.spacing(0.375, 0), '!important'],
    ' *': {
      padding: '0 !important',
    },
  },
  ripple: {
    padding: 0,
  },
}));

/**
 * Renders the Change Location button.
 * @param {Object} props The component props.
 * @param {Function} props.onClick The click handler.
 * @param {boolean} [props.disabled=false] Whether the button is disabled.
 * @returns {JSX.Element} The rendered component.
 */
export const ChangeLocationButtonUnwrapped = ({ onClick, disabled }) => {
  const { classes } = useStyles();

  return (
    <SurroundPortals
      portalName={PRODUCT_FULFILLMENT_CHANGE_LOCATION}
      portalProps={{
        onClick,
        disabled,
      }}
    >
      <RippleButton
        onClick={onClick}
        className={classes.button}
        disabled={disabled}
        rippleClassName={classes.ripple}
        type="secondary"
        flat
      >
        <I18n.Text string="locations.change_location" />
      </RippleButton>
    </SurroundPortals>
  );
};

ChangeLocationButtonUnwrapped.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ChangeLocationButtonUnwrapped.defaultProps = {
  disabled: false,
};

export const ChangeLocationButton = React.memo(ChangeLocationButtonUnwrapped);
