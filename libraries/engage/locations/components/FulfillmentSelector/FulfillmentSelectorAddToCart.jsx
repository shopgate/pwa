import { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { isProductAvailable } from '../../helpers';
import { FULFILLMENT_PATH_MULTI_LINE_RESERVE } from '../../constants';
import connect from './FulfillmentSelectorAddToCart.connector';

/**
 * Interject add to cart flow.
 * @param {Object} location The selected location.
 * @param {Conditioner} conditioner conditioner.
 * @param {string[]} fulfillmentPaths fulfillmentPaths
 * @returns {JSX}
 */
const FulfillmentSelectorAddToCart = ({ location, conditioner, fulfillmentPaths }) => {
  // Add to cart effect to validate inventory
  useEffect(() => {
    // Add most late conditioner
    conditioner.addConditioner('fulfillment-inventory', () => {
      if (!fulfillmentPaths.includes(FULFILLMENT_PATH_MULTI_LINE_RESERVE)) {
        // @TODO Open Fulfillment Sheet / Reservation Form
        return false;
      }
      return isProductAvailable(location);
    }, 100);

    return () => conditioner.removeConditioner('fulfillment-inventory');
  }, [conditioner, location, fulfillmentPaths]);

  return null;
};

FulfillmentSelectorAddToCart.propTypes = {
  conditioner: PropTypes.shape().isRequired,
  fulfillmentPaths: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape(),
};

FulfillmentSelectorAddToCart.defaultProps = {
  fulfillmentPaths: [],
  location: null,
};

export default memo(connect(FulfillmentSelectorAddToCart));
