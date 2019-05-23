import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import appConfig from '@shopgate/pwa-common/helpers/config';
import AverageRating from '../AverageRating';
import WriteReviewLink from '../WriteReviewLink';
import * as styles from './style';

/**
 * @return {JSX}
 */
const NoReviews = ({ productId }) => (
  <div className={styles.container}>
    <AverageRating productId={productId} />
    <div className={styles.noReviews}>
      {appConfig.showWriteReview && (
        <Fragment>
          <I18n.Text string="reviews.no_reviews" />
          <WriteReviewLink productId={productId} />
        </Fragment>
      )}
    </div>
  </div>
);

NoReviews.propTypes = {
  productId: PropTypes.string,
};

NoReviews.defaultProps = {
  productId: null,
};

export default NoReviews;
