import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Picker from 'Components/Picker';
import PriceDifference from '../PriceDifference';
import styles from './style';

/**
 * @param {Object} props The compoent props.
 * @returns {JSX}
 */
const Option = ({
  id,
  label,
  items,
  value,
  onChange,
}) => (
  <div key={id} data-test-id={label}>
    <Picker
      label={label}
      items={items.map(item => ({
        ...item,
        rightComponent: (
          <PriceDifference className={styles} currency={item.currency} difference={item.price} />
        ),
      }))}
      placeholder={<I18n.Text string="product.pick_an_attribute" params={[label]} />}
      value={value}
      onChange={val => onChange(id, val)}
    />
  </div>
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
