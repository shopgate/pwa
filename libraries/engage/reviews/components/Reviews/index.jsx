import React from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { SurroundPortals } from '@shopgate/engage/components';
import { PRODUCT_REVIEWS } from '@shopgate/engage/product';
import List from './components/List';
import Header from './components/Header';
import AllReviewsLink from './components/AllReviewsLink';
import ReviewsInfo from './components/ReviewsInfo';
import styles from './style';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @param {Object} props.productId The id of the product, the review belongs to.
 * @param {Array} props.reviews Reviews which should be shown in the product page.
 * @returns {JSX}
 */
function Reviews({ productId, productActive, reviews }) {
  return (
    <SurroundPortals
      portalName={PRODUCT_REVIEWS}
      portalProps={{ productId }}
    >
      {(appConfig.hasReviews && productActive) && (
        <div className={`${styles.container} engage__reviews__reviews`} data-test-id="reviewSection">
          <Header productId={productId} />
          <List productId={productId} reviews={reviews} />
          <AllReviewsLink productId={productId} />
          <ReviewsInfo />
        </div>
      )}
    </SurroundPortals>
  );
}

Reviews.propTypes = {
  productActive: PropTypes.bool,
  productId: PropTypes.string,
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

Reviews.defaultProps = {
  productId: null,
  productActive: true,
  reviews: null,
};

export default connect(Reviews);
