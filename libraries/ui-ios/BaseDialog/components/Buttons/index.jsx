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
    // The dialog label colour is merchant configurable and overrides the button's own colour.
    '& > *': {
      color: 'var(--color-button-dialog-ios, #1a73e8)',
    },
    fontWeight: theme.typography.fontWeightRegular,
    minWidth: '50%',
    flexGrow: 1,
    // Keeps the row at the height an iOS alert button had before: the shared button line height of
    // 1.75 is far looser than these need, and 1px of the padding is now taken by the transparent
    // border that every variant reserves.
    lineHeight: 1.2,
    paddingTop: 11,
    paddingBottom: 11,
    marginBottom: -1,
    marginRight: theme.spacing(-0.5),
    // An iOS alert button flashes a neutral highlight while pressed rather than tinting with the
    // brand colour, and only pointer devices get a hover state at all.
    '&:active': {
      background: pressedColor,
    },
    // A focus ring is wrong for a dialog row, but keyboard users still need to see where they are,
    // so the row highlights instead of drawing an outline around it.
    '&:focus-visible': {
      outline: 'none',
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
      variant="text"
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
