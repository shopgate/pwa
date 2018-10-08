import React from 'react';
import PropTypes from 'prop-types';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@virtuous/react-conductor/Router';
import View from 'Components/View';
import ReviewForm from './components/ReviewForm';

/**
 * The view that holds a review form.
 * @param {string} productId The product id prop
 * @return {JSX}
 * @constructor
 */
const WriteReview = ({ productId }) => (
  <View>
    {productId && <ReviewForm productId={productId} />}
  </View>
);

WriteReview.propTypes = {
  productId: PropTypes.string,
};

WriteReview.defaultProps = {
  productId: null,
};

export default () => (
  <RouteContext.Consumer>
    {({ params }) => (
      <WriteReview productId={hex2bin(params.productId) || null} />
    )}
  </RouteContext.Consumer>
);

export { WriteReview as UnwrappedWriteReview };
