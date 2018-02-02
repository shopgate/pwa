/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import RatingStars from 'Components/RatingStars';
import RatingCount from 'Components/Reviews/components/RatingCount';
import { container } from './style';
import connect from './connector';

/**
 * Scrolls page to reviews excerpt.
 */
const scrollToRating = () => {
  const reviewsExcerpt = document.getElementById('reviewsExcerpt');
  if (
    typeof reviewsExcerpt !== 'object'
    || !reviewsExcerpt
    || !reviewsExcerpt.offsetTop
    || !reviewsExcerpt.closest
    || !reviewsExcerpt.closest('article')
  ) {
    return;
  }

  reviewsExcerpt
    .closest('article')
    .scroll(0, reviewsExcerpt.offsetTop - 30);
};
/**
 * The Rating component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Rating = ({ rating }) => {
  if (!appConfig.hasReviews || !rating || !rating.count) {
    return null;
  }

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events
    <div
      className={container}
      onClick={scrollToRating}
      role="link"
    >
      <RatingStars value={rating.average} display="big" />
      <RatingCount count={rating.count} prominent />
    </div>
  );
};

Rating.propTypes = {
  rating: PropTypes.shape(),
};

Rating.defaultProps = {
  rating: null,
};

export default connect(Rating);
