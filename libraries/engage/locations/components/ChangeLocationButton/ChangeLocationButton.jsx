import React from 'react';
import PropTypes from 'prop-types';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import { PRODUCT_FULFILLMENT_CHANGE_LOCATION } from '../../constants/Portals';

const useStyles = makeStyles()(theme => ({
  button: {
    fontSize: theme.typography.caption.fontSize,
    padding: 0,
    letterSpacing: '0.05em',
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
      <Button
        variant="link"
        color="primary"
        size="small"
        dense
        onClick={onClick}
        className={classes.button}
        disabled={disabled}
      >
        <I18n.Text string="locations.change_location" />
      </Button>
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
