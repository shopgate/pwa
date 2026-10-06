import React from 'react';
import PropTypes from 'prop-types';
import { RouteContext } from '@shopgate/pwa-common/context';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { View } from '@shopgate/engage/components';
import { ReviewsPage } from '@shopgate/engage/reviews';
import { BackBar } from 'Components/AppBar/presets';

/**
 * The product reviews page.
 * @return {JSX}
 */
const Reviews = ({ id }) => (
  <View aria-hidden={false}>
    {id && (
      <>
        <BackBar title="titles.reviews" right={null} />
        <ReviewsPage productId={id} />
      </>
    )}
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
