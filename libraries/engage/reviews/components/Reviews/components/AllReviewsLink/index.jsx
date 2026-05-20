import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { I18n } from '@shopgate/engage/components';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import { REVIEW_PREVIEW_COUNT } from '@shopgate/pwa-common-commerce/reviews/constants';
import ButtonLink from '@shopgate/pwa-ui-shared/ButtonLink';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    textAlign: 'right',
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(-2),
  },
}));

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AllReviewsLink = (props) => {
  const { classes, cx } = useStyles();

  if (!props.productId || props.count <= REVIEW_PREVIEW_COUNT) {
    return null;
  }

  return (
    <div className={cx(classes.container, 'engage__reviews__all-reviews-link')} data-test-id="showAllReviewsButton">
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
