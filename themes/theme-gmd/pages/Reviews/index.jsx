import React from 'react';
import PropTypes from 'prop-types';
import { RouteContext, hex2bin } from '@shopgate/engage/core';
import View from 'Components/View';
import ReviewsContent from './components/Content';

/**
 * The product detail page (PDP).
 * @return {JSX}
 */
const Reviews = ({ id }) => (
  <View>
    {id && <ReviewsContent productId={id} />}
  </View>
);

Reviews.propTypes = {
  id: PropTypes.string,
};

Reviews.defaultProps = {
  id: null,
};

export default () => (
  <RouteContext.Consumer>
    {({ params }) => (
      <Reviews id={hex2bin(params.productId) || null} />
    )}
  </RouteContext.Consumer>
);

export { Reviews as UnwrappedReviews };
