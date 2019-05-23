import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/engage/core';
import { I18n, ButtonLink } from '@shopgate/engage/components';
import { ITEM_PATH } from '@shopgate/engage/product';
import { REVIEW_PREVIEW_COUNT } from '@shopgate/engage/reviews';
import connect from './connector';
import { container } from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AllReviewsLink = (props) => {
  if (!props.productId || props.count <= REVIEW_PREVIEW_COUNT) {
    return null;
  }

  return (
    <div className={container} data-test-id="showAllReviewsButton">
      <ButtonLink href={`${ITEM_PATH}/${bin2hex(props.productId)}/reviews`}>
        <I18n.Text string="reviews.button_all" params={props} />
      </ButtonLink>
    </div>
  );
};

AllReviewsLink.propTypes = {
  count: PropTypes.number,
  productId: PropTypes.string,
};

AllReviewsLink.defaultProps = {
  count: 0,
  productId: null,
};

export default connect(AllReviewsLink);
