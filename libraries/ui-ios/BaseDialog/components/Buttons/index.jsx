import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import Button from '@shopgate/pwa-ui-shared/Button';
import { makeStyles } from '@shopgate/engage/styles';
import classNames from 'classnames';

const borderColor = 'rgba(0,0,0,0.2)';

const useStyles = makeStyles()(theme => ({
  button: {
    '&& > *': {
      color: 'var(--color-button-dialog-ios, #1a73e8)',
    },
    '&&': {
      fontWeight: 400,
      minWidth: '50%',
      flexGrow: 1,
      paddingTop: 10,
      paddingBottom: 10,
    },
    marginBottom: -1,
    marginRight: theme.spacing(-0.5),
    '&:not(:last-child)': {
      borderRadius: '0 !important',
      borderRight: `0.5px solid ${borderColor}`,
      borderBottom: `0.5px solid ${borderColor}`,
    },
  },
  buttonPrimary: {
    '&&': {
      fontWeight: 400,
    },
  },
  buttonText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
  },
}));

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Buttons = ({ actions }) => {
  const { classes } = useStyles();

  return actions.map(({
    label, action, type = 'normal', disabled = false,
  }) => (
    <Button
      key={label}
      className={classNames(classes.button, type === 'primary' && classes.buttonPrimary)}
      type="primary"
      onClick={action}
      disabled={disabled}
      flat
    >
      <I18n.Text className={classes.buttonText} string={label} />
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
