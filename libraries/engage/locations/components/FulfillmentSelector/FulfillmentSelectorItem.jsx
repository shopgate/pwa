// @flow
import * as React from 'react';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioCheckedIcon';
import UncheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioUncheckedIcon';
import { type Selection } from './FulfillmentSelector.types';
import {
  radioContainer,
  activeIcon,
  activeIconDisabled,
  inactiveIcon,
  inactiveIconDisabled,
  radio,
  content,
} from './FulfillmentSelectorItem.style';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';

type Props = {
  name: Selection,
  children: React.Node,
  onChange: (name: Selection) => void,
  disabled?: boolean,
}

/**
 * Renders a fulfillment selector radio item.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function FulfillmentSelectorItemUnwrapped(props: Props) {
  const {
    name, children, onChange, disabled,
  } = props;
  const {
    selection,
  } = useFulfillmentSelectorState();
  const checked = selection === name;

  /**
   * Handle the change to the radio item.
   * @param {Object} event The change event.
   */
  function handleChange(event: SyntheticInputEvent<HTMLInputElement>) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    onChange(name);
  }

  return (
    <label htmlFor={name} className={radioContainer} onClick={handleChange}>
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
}

FulfillmentSelectorItemUnwrapped.defaultProps = {
  disabled: false,
};

export const FulfillmentSelectorItem = React.memo<Props>(FulfillmentSelectorItemUnwrapped);
