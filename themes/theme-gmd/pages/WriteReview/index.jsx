import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { hex2bin, RouteContext } from '@shopgate/engage/core';
import View from 'Components/View';
import { BackBar } from 'Components/AppBar/presets';
import ReviewForm from './components/ReviewForm';

/**
 * The view that holds a review form.
 * @param {string} productId The product id prop
 * @return {JSX}
 * @constructor
 */
const WriteReview = ({ productId, visible }) => (
  <View>
    {(productId && visible) && (
      <Fragment>
        <BackBar title="titles.reviews" right={null} />
        <ReviewForm productId={productId} />
      </Fragment>
    )}
  </View>
);

WriteReview.propTypes = {
  visible: PropTypes.bool.isRequired,
  productId: PropTypes.string,
};

WriteReview.defaultProps = {
  productId: null,
};

export default () => (
  <RouteContext.Consumer>
    {({ params, visible }) => (
      <WriteReview productId={hex2bin(params.productId) || null} visible={visible} />
    )}
  </RouteContext.Consumer>
);

export { WriteReview as UnwrappedWriteReview };
