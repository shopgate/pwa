import { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { isProductAvailable } from '../../helpers';
import { FULFILLMENT_PATH_MULTI_LINE_RESERVE, PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP } from '../../constants';
import { FulfillmentSheet } from '../FulfillmentSheet';
import connect from './FulfillmentSelectorAddToCart.connector';

/**
 * Interject add to cart flow.
 * @param {Object} location The selected location.
 * @param {Conditioner} conditioner conditioner.
 * @param {string[]} fulfillmentPaths fulfillmentPaths
 * @param {string} fulfillmentMethod fulfillmentMethod
 * @returns {JSX}
 */
const FulfillmentSelectorAddToCart = ({
  location, conditioner, fulfillmentPaths, fulfillmentMethod,
}) => {
  // Add to cart effect to validate inventory
  useEffect(() => {
    // Add most late conditioner
    conditioner.addConditioner('fulfillment-inventory', () => {
      // Allow direct ship item
      if (fulfillmentMethod === PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP) {
        return true;
      }
      if (!fulfillmentPaths.includes(FULFILLMENT_PATH_MULTI_LINE_RESERVE)) {
        if (isProductAvailable(location)) {
          // Open reservation form. Stop adding to a cart
          FulfillmentSheet.open(null, 1);
        }
        return false;
      }
      return isProductAvailable(location);
    }, 100);

    return () => conditioner.removeConditioner('fulfillment-inventory');
  }, [conditioner, location, fulfillmentPaths, fulfillmentMethod]);

  return null;
};

FulfillmentSelectorAddToCart.propTypes = {
  conditioner: PropTypes.shape().isRequired,
  fulfillmentMethod: PropTypes.string,
  fulfillmentPaths: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape(),
};

FulfillmentSelectorAddToCart.defaultProps = {
  fulfillmentMethod: PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
  fulfillmentPaths: [],
  location: null,
};

export default connect(memo(FulfillmentSelectorAddToCart));
