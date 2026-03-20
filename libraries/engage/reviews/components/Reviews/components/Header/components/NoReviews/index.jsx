import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import appConfig, { themeConfig } from '@shopgate/pwa-common/helpers/config';
import AverageRating from '../AverageRating';
import WriteReviewLink from '../WriteReviewLink';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    fontWeight: 500,
    margin: 0,
  },
  noReviews: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: variables.gap.small,
    padding: `0 ${variables.gap.small}px`,
    textAlign: 'center',
  },
});

/**
 * @return {JSX.Element}
 */
const NoReviews = ({ productId }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <AverageRating productId={productId} />
      <div className={classes.noReviews}>
        {appConfig.showWriteReview && (
          <>
            <I18n.Text string="reviews.no_reviews" />
            <WriteReviewLink productId={productId} />
          </>
        )}
      </div>
    </div>
  );
};

NoReviews.propTypes = {
  productId: PropTypes.string,
};

NoReviews.defaultProps = {
  productId: null,
};

export default NoReviews;
