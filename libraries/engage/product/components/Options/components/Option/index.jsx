import React from 'react';
import PropTypes from 'prop-types';
import { I18n, PickerUtilize as Picker } from '@shopgate/engage/components';
import { PriceDifference } from '@shopgate/engage/product/components';
import { ProductContext } from '@shopgate/engage/product/contexts';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Option = ({
  id,
  label,
  items,
  value,
  onChange,
}) => (
  <ProductContext.Consumer>
    {({ currency }) => (
      <div key={id} data-test-id={label}>
        <Picker
          label={label}
          items={items.map(item => ({
            ...item,
            rightComponent: (
              <PriceDifference
                currency={currency}
                difference={item.priceDifference}
              />
            ),
          }))}
          placeholder={<I18n.Text string="product.pick_an_attribute" params={[label]} />}
          value={value}
          onChange={val => onChange(id, val, items.find(item => item.value === val).price)}
        />
      </div>
    )}
  </ProductContext.Consumer>
);

Option.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

Option.defaultProps = {
  value: null,
};

export default Option;
