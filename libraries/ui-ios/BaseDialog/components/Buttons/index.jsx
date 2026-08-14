import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';

const borderColor = 'rgba(0,0,0,0.2)';
const pressedColor = 'rgba(0,0,0,0.08)';
const hoverColor = 'rgba(0,0,0,0.04)';

const useStyles = makeStyles()(theme => ({
  button: {
    '& > *': {
      color: 'var(--color-button-dialog-ios, #1a73e8)',
    },
    fontWeight: theme.typography.fontWeightRegular,
    minWidth: '50%',
    flexGrow: 1,
    lineHeight: 1.2,
    paddingTop: 11,
    paddingBottom: 11,
    marginBottom: -1,
    marginRight: theme.spacing(-0.5),
    '&:active': {
      background: pressedColor,
    },
    '&:focus-visible': {
      background: pressedColor,
    },
    '@media (hover: hover)': {
      '&:hover': {
        background: hoverColor,
      },
    },
    '&:not(:last-child)': {
      borderRadius: 0,
      borderRight: `0.5px solid ${borderColor}`,
      borderBottom: `0.5px solid ${borderColor}`,
    },
  },
  buttonPrimary: {
    fontWeight: theme.typography.fontWeightRegular,
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
  const { classes, cx } = useStyles();

  return actions.map(({
    label, action, type = 'normal', disabled = false,
  }) => (
    <Button
      key={label}
      className={cx(classes.button, type === 'primary' && classes.buttonPrimary)}
      variant="link"
      color="secondary"
      onClick={action}
      disabled={disabled}
      disableRipple
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
