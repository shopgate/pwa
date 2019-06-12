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
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @param {Object} props.rating Rating of the product.
 * @param {Array} props.reviews Reviews which should be shown in the product page.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const Reviews = ({ productId, reviews }, context) => {
  const { __ } = context.i18n();
  return (
    <Fragment>
      <Portal name={PRODUCT_REVIEWS_BEFORE} />
      <Portal name={PRODUCT_REVIEWS}>
        {appConfig.hasReviews && (
          <section className={styles.container} data-test-id="reviewSection" aria-label={__('product.sections.ratings')}>
            <Header productId={productId} />
            <List productId={productId} reviews={reviews} />
            <AllReviewsLink productId={productId} />
          </section>
        )}
      </Portal>
      <Portal name={PRODUCT_REVIEWS_AFTER} />
    </Fragment>
  );
};

Reviews.propTypes = {
  productId: PropTypes.string,
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

Reviews.defaultProps = {
  productId: null,
  reviews: null,
};

Reviews.contextTypes = {
  i18n: PropTypes.func,
};

export default connect(Reviews);
