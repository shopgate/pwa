import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import { i18n } from '@shopgate/engage/core';
import { Image } from '@shopgate/engage/components';
import { useCheckoutContext } from '@shopgate/engage/checkout/hooks/common';
import ShippingMethodIcon from '@shopgate/pwa-ui-shared/icons/ShippingMethodIcon';

const styles = {
  root: css({
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
  }).toString(),
  rootDisabled: css({
    opacity: 0.5,
  }).toString(),
  imageContainer: css({
    width: 32,
    heigh: 32,
    marginRight: 8,
    flexShrink: 0,
  }).toString(),
  image: css({
    width: '100%',
    height: '100%',
  }).toString(),
  label: css({
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  }).toString(),
  name: css({
    marginRight: 8,
  }).toString(),
};

/**
 * The shipping methods component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ShippingMethod = ({ shippingMethod }) => {
  const { currencyCode } = useCheckoutContext();
  const { serviceLevel } = shippingMethod;
  const [useImage, setUseImage] = useState(!!serviceLevel?.iconUrl);

  return (
    <div className={classNames(styles.root)}>
      <div className={styles.imageContainer}>
        { useImage ? (
          <Image
            className={styles.image}
            src={serviceLevel?.iconUrl}
            onError={() => setUseImage(false)}
          />
        ) : <ShippingMethodIcon className={styles.image} />}
      </div>
      <div className={styles.label}>
        <span className={styles.name}>
          {serviceLevel?.name}
        </span>
        <span>
          { serviceLevel?.cost ? (
            i18n.price(serviceLevel?.cost, currencyCode, 2)
          ) : (
            i18n.text('shipping.free_short')
          )}
        </span>
      </div>
    </div>
  );
};

ShippingMethod.propTypes = {
  shippingMethod: PropTypes.shape().isRequired,
};

export default ShippingMethod;
