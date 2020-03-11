// @flow
import * as React from 'react';
import { i18n } from '../../../core';
import { RadioGroupItem } from '../../../components';
import { radioItem, itemLabel } from './FulfillmentPath.style';

type Props = {
  children?: React.Node | null,
  name: string,
}

/**
 * Renders a RadioItem element to be used by the FulfillmentPathSelector component.
 * This component is meant to be rendered as child of a RadioGroup.
 * @param {Object} props All props required by the RadioGroupItem component to work.
 * @returns {JSX}
 */
export const FulfillmentPathItem = ({ name, children, ...rest }: Props) => (
  <RadioGroupItem
    {...rest}
    name={name}
    className={radioItem}
    label={(
      <div className={itemLabel}>
        <span>{i18n.text(name)}</span>
        {children}
      </div>
    )}
  />
);

FulfillmentPathItem.defaultProps = {
  children: null,
};
