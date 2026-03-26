import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import Button from '@shopgate/pwa-ui-shared/Button';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  button: {
    marginRight: theme.spacing(-0.5),
    textAlign: 'right',
  },
}));

/**
 * Buttons component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Buttons = ({ actions }) => {
  const { classes } = useStyles();

  return actions.map(({ label, action, disabled = false }) => (
    <Button
      key={label}
      className={classes.button}
      flat
      type="primary"
      onClick={action}
      disabled={disabled}
    >
      <I18n.Text string={label} />
    </Button>
  ));
};

Buttons.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  })),
};

Buttons.defaultProps = {
  actions: [],
};

export default memo(Buttons);
