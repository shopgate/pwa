import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_REVIEWS,
  PRODUCT_REVIEWS_AFTER,
  PRODUCT_REVIEWS_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import List from './components/List';
import Header from './components/Header';
import AllReviewsLink from './components/AllReviewsLink';
import styles from './style';

/**
 * @param {Object} rating Rating of the product.
 * @param {Array} reviews Reviews which should be shown in the product page.
 * @returns {JSX}
 */
const Reviews = ({ productId }) => (
  <Fragment>
    <Portal name={PRODUCT_REVIEWS_BEFORE} />
    <Portal name={PRODUCT_REVIEWS}>
      {appConfig.hasReviews && (
        <div className={styles.container} data-test-id="reviewSection">
          <Header productId={productId} />
          <List productId={productId} />
          <AllReviewsLink productId={productId} />
        </div>
      )}
    </Portal>
    <Portal name={PRODUCT_REVIEWS_AFTER} />
  </Fragment>
);

Reviews.propTypes = {
  productId: PropTypes.string,
};

Reviews.defaultProps = {
  productId: null,
};

export default Reviews;
