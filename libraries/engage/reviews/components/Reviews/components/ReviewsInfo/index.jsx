import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { Link } from '@shopgate/engage/components';

const styles = {
  root: css({
    textAlign: 'center',
    marginTop: 16,
    fontSize: '.875rem',
    fontWeight: 300,
    lineHeight: 1.5,
    padding: '0.8125rem 1rem 1rem',
  }).toString(),
  link: css({
    textAlign: 'center',
    fontWeight: 600,
    marginTop: 8,
  }).toString(),
};

const {
  reviewsInfo: {
    text,
    linkText,
    linkUrl,
  } = {},
} = appConfig;

/**
 * The ReviewsInfo component
 * @param {Object} props The component props
 * @param {Array} [props.reviews] The reviews shown inside the Reviews component
 * @returns {JSX}
 */
const ReviewsInfo = ({
  reviews,
}) => {
  if (!Array.isArray(reviews) || reviews.length === 0 || !text) {
    return null;
  }

  return (
    <div className={classNames(styles.root, 'engage__reviews__review_info_text')}>
      <div>
        {text}
        { linkText && linkUrl && (
          <Link href={linkUrl} className={styles.link}>
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

ReviewsInfo.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

ReviewsInfo.defaultProps = {
  reviews: [],
};

export default ReviewsInfo;
