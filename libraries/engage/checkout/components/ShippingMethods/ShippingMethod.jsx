import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { Image } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useCheckoutContext } from '@shopgate/engage/checkout/hooks/common';
import ShippingMethodIcon from '@shopgate/pwa-ui-shared/icons/ShippingMethodIcon';

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
  },
  imageContainer: {
    width: 32,
    heigh: 32,
    marginRight: 8,
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  name: {
    marginRight: 8,
  },
});

/**
 * The shipping methods component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ShippingMethod = ({ shippingMethod }) => {
  const { classes } = useStyles();
  const { currencyCode } = useCheckoutContext();
  const { serviceLevel } = shippingMethod;
  const [useImage, setUseImage] = useState(!!serviceLevel?.iconUrl);

  return (
    <div className={classes.root}>
      <div className={classes.imageContainer}>
        { useImage ? (
          <Image
            className={classes.image}
            src={serviceLevel?.iconUrl}
            onError={() => setUseImage(false)}
          />
        ) : <ShippingMethodIcon className={classes.image} />}
      </div>
      <div className={classes.label}>
        <span className={classes.name}>
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
