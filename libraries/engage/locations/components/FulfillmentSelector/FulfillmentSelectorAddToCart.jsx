import { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { isProductAvailable } from '../../helpers';
import {
  FULFILLMENT_PATH_MULTI_LINE_RESERVE,
  FULFILLMENT_PATH_QUICK_RESERVE,
  PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
  STAGE_RESERVE_FORM,
} from '../../constants';
import { FulfillmentSheet } from '../FulfillmentSheet';
import { FulfillmentPathSelector } from '../FulfillmentPathSelector';
import connect from './FulfillmentSelectorAddToCart.connector';

/**
 * Opens the fulfillment path selector and returns a promise that resolves after selection.
 * @returns {Promise}
 */
function promisifiedFulfillmentPathSelector() {
  return new Promise((resolve) => {
    FulfillmentPathSelector.open((selectedPath) => {
      resolve(selectedPath);
    });
  });
}

/**
 * Interject add to cart flow.
 * @param {Object} location The selected location.
 * @param {Conditioner} conditioner conditioner.
 * @param {string[]} fulfillmentPaths fulfillmentPaths
 * @param {string} userFulfillmentMethod The currenly selected fulfillment method of the user.
 * @returns {JSX}
 */
const FulfillmentSelectorAddToCart = ({
  location, conditioner, fulfillmentPaths, userFulfillmentMethod,
}) => {
  // Add to cart effect to validate inventory
  useEffect(() => {
    // Add most late conditioner
    conditioner.addConditioner('fulfillment-inventory', async () => {
      // Allow direct ship item
      if (userFulfillmentMethod === PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP) {
        return true;
      }

      if (!isProductAvailable(location)) {
        return false;
      }

      if (fulfillmentPaths.length > 1) {
        const selectedPath = await promisifiedFulfillmentPathSelector();

        if (selectedPath === FULFILLMENT_PATH_MULTI_LINE_RESERVE) {
          return true;
        }

        if (selectedPath === FULFILLMENT_PATH_QUICK_RESERVE) {
          FulfillmentSheet.open({
            stage: STAGE_RESERVE_FORM,
            fulfillmentPath: selectedPath,
          });
          return false;
        }

        return false;
      }

      if (!fulfillmentPaths.includes(FULFILLMENT_PATH_MULTI_LINE_RESERVE)) {
        // Open reservation form. Stop adding to a cart
        FulfillmentSheet.open({
          stage: STAGE_RESERVE_FORM,
        });
        return false;
      }

      return isProductAvailable(location);
    }, 100);

    return () => conditioner.removeConditioner('fulfillment-inventory');
  }, [conditioner, location, fulfillmentPaths, userFulfillmentMethod]);

  return null;
};

FulfillmentSelectorAddToCart.propTypes = {
  conditioner: PropTypes.shape().isRequired,
  fulfillmentPaths: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape(),
  userFulfillmentMethod: PropTypes.string,
};

FulfillmentSelectorAddToCart.defaultProps = {
  userFulfillmentMethod: PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
  fulfillmentPaths: [],
  location: null,
};

export default connect(memo(FulfillmentSelectorAddToCart));
