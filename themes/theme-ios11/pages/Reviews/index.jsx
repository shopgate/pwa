import React from 'react';
import PropTypes from 'prop-types';
import { RouteContext } from '@shopgate/pwa-common/context';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { View } from '@shopgate/engage/components';
import ReviewsContent from './components/Content';

/**
 * The product detail page (PDP).
 * @return {JSX}
 */
const Reviews = ({ id }) => (
  <View aria-hidden={false}>
    {/*
    variantId needs to be != undefined here.
    otherwise getCollectionForCurrentBaseProduct will not work
    */}
    {id && <ReviewsContent productId={id} variantId={null} />}
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
