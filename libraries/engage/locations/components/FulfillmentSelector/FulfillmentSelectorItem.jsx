import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioCheckedIcon';
import UncheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioUncheckedIcon';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { DIRECT_SHIP, ROPIS, BOPIS } from '../../constants';

/** @typedef {import('./FulfillmentSelector.types').Selection} Selection */

const useStyles = makeStyles()(theme => ({
  radioContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    padding: theme.spacing(0.5, 0),
  },
  disabled: {
    cursor: 'not-allowed',
  },
  inactiveIcon: {
    width: 24,
    height: 24,
    flexShrink: 0,
    marginTop: '-1px',
    marginRight: theme.spacing(1),
    color: 'var(--color-text-medium-emphasis)',
  },
  inactiveIconDisabled: {
    width: 24,
    height: 24,
    flexShrink: 0,
    marginTop: '-1px',
    marginRight: theme.spacing(1),
    color: 'var(--color-text-medium-emphasis)',
    opacity: 0.3,
  },
  activeIcon: {
    width: 24,
    height: 24,
    flexShrink: 0,
    marginTop: '-1px',
    marginRight: theme.spacing(1),
    color: 'var(--color-primary)',
  },
  activeIconDisabled: {
    width: 24,
    height: 24,
    flexShrink: 0,
    marginTop: '-1px',
    marginRight: theme.spacing(1),
    color: 'var(--color-primary)',
    opacity: 0.3,
  },
  radio: {
    display: 'none',
  },
  content: {
    flexGrow: 1,
    color: theme.palette.text.primary,
  },
}));

/**
 * Renders a fulfillment selector radio item.
 * @param {Object} props The component props.
 * @param {Selection} props.name The name of the selection.
 * @param {React.ReactNode} props.children The child elements.
 * @param {function(Selection): void} props.onChange The change handler.
 * @param {boolean} [props.disabled=false] Whether the item is disabled.
 * @returns {JSX.Element} The rendered component.
 */
const FulfillmentSelectorItemUnwrapped = ({
  name, children, onChange, disabled,
}) => {
  const { classes, cx } = useStyles();
  const { selection } = useFulfillmentSelectorState();
  const checked = selection === name;

  /**
   * Handle the change to the radio item.
   * @param {React.MouseEvent<HTMLLabelElement>} event The click event.
   */
  const handleChange = (event) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    onChange(name);
  };

  const containerClasses = cx(classes.radioContainer, {
    [classes.disabled]: disabled,
  });

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <label
      htmlFor={name}
      className={containerClasses}
      onClick={handleChange}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      role="radio"
      aria-checked={checked}
      tabIndex="0"
    >
      {checked
        ? <CheckedIcon className={disabled ? classes.activeIconDisabled : classes.activeIcon} />
        : <UncheckedIcon
            className={disabled ? classes.inactiveIconDisabled : classes.inactiveIcon}
        />}
      <input type="radio" checked={checked} name={name} className={classes.radio} readOnly />
      <div className={classes.content}>
        {children}
      </div>
    </label>
  );
};

FulfillmentSelectorItemUnwrapped.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.oneOf([DIRECT_SHIP, ROPIS, BOPIS, null]).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

FulfillmentSelectorItemUnwrapped.defaultProps = {
  disabled: false,
};

export const FulfillmentSelectorItem = React.memo(FulfillmentSelectorItemUnwrapped);
