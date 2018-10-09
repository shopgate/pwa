import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@virtuous/react-conductor/Router';
import View from 'Components/View';
import { BackBar } from 'Components/AppBar/presets';
import ReviewForm from './components/ReviewForm';

/**
 * The view that holds a review form.
 * @param {string} productId The product id prop
 * @return {JSX}
 * @constructor
 */
const WriteReview = ({ productId }) => (
  <View>
    {productId && (
      <Fragment>
        <BackBar title="titles.reviews" right={null} />
        <ReviewForm productId={productId} />
      </Fragment>
    )}
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
