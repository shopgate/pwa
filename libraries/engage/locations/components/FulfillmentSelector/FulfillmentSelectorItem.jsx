import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioCheckedIcon';
import UncheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioUncheckedIcon';
import {
  radioContainer,
  disabled as radioContainerDisabled,
  activeIcon,
  activeIconDisabled,
  inactiveIcon,
  inactiveIconDisabled,
  radio,
  content,
} from './FulfillmentSelectorItem.style';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { DIRECT_SHIP, ROPIS, BOPIS } from '../../constants';

/** @typedef {import('./FulfillmentSelector.types').Selection} Selection */

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

  const containerClasses = classNames(radioContainer.toString(), {
    [radioContainerDisabled.toString()]: disabled,
  });

  return (
    <label
      htmlFor={name}
      className={containerClasses}
      onClick={handleChange}
      role="radio"
      aria-checked={checked}
      tabIndex="0"
    >
      {checked
        ? <CheckedIcon className={disabled ? activeIconDisabled : activeIcon} />
        : <UncheckedIcon className={disabled ? inactiveIconDisabled : inactiveIcon} />
      }
      <input type="radio" checked={checked} name={name} className={radio} readOnly />
      <div className={content}>
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
