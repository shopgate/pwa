import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core';
import { RadioGroupItem } from '../../../components';
import { radioItem, itemLabel } from './FulfillmentPath.style';

/**
 * Renders a RadioItem element to be used by the FulfillmentPathSelector component.
 * This component is meant to be rendered as a child of a RadioGroup.
 * @param {Object} props The component props required by the RadioGroupItem component.
 * @param {React.ReactNode|null} [props.children=null] The child elements.
 * @param {string} props.name The name of the radio item.
 * @returns {JSX.Element} The rendered component.
 */
export const FulfillmentPathItem = ({ name, children, ...rest }) => (
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

FulfillmentPathItem.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
};

FulfillmentPathItem.defaultProps = {
  children: null,
};
