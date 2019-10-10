import React from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { SurroundPortals } from '@shopgate/engage/components';
import { PRODUCT_REVIEWS } from '@shopgate/engage/product';
import List from './components/List';
import Header from './components/Header';
import AllReviewsLink from './components/AllReviewsLink';
import styles from './style';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @param {Object} props.productId The id of the product, the review belongs to.
 * @param {Array} props.reviews Reviews which should be shown in the product page.
 * @returns {JSX}
 */
function Reviews({ productId, reviews }) {
  return (
    <SurroundPortals portalName={PRODUCT_REVIEWS}>
      {appConfig.hasReviews && (
        <div className={styles.container} data-test-id="reviewSection">
          <Header productId={productId} />
          <List productId={productId} reviews={reviews} />
          <AllReviewsLink productId={productId} />
        </div>
      )}
    </SurroundPortals>
  );
}

Reviews.propTypes = {
  productId: PropTypes.string,
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

Reviews.defaultProps = {
  productId: null,
  reviews: null,
};

export default connect(Reviews);
