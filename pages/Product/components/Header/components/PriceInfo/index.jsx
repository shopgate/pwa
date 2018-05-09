import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import PriceInfoBase from '@shopgate/pwa-ui-shared/PriceInfo';
import connect from './connector';
import styles from './style';

/**
 * The PriceInfo component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PriceInfo = ({ price }) => (
  <PlaceholderLabel ready={(price !== null)} className={styles.placeholder}>
    {(price && price.info !== '') && (
      <PriceInfoBase className={styles.priceInfo} text={price.info} />
    )}
  </PlaceholderLabel>
);

PriceInfo.propTypes = {
  price: PropTypes.shape(),
};

PriceInfo.defaultProps = {
  price: '',
};

export default connect(PriceInfo);
