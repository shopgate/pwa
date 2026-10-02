import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { I18n } from '@shopgate/engage/components';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import { REVIEW_PREVIEW_COUNT } from '@shopgate/pwa-common-commerce/reviews/constants';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  fullWidth: {
    display: 'block',
    marginTop: theme.spacing(2),
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
    <div
      className={cx(
        classes.container,
        { [classes.fullWidth]: props.fullWidth },
        'engage__reviews__all-reviews-link'
      )}
      data-test-id="showAllReviewsButton"
      data-full-width={props.fullWidth || undefined}
    >
      <Button
        variant={props.fullWidth ? 'outlined' : 'text'}
        color="primary"
        fullWidth={props.fullWidth}
        href={`${ITEM_PATH}/${bin2hex(props.productId)}/reviews`}
      >
        <I18n.Text string="reviews.button_all" params={props} />
      </Button>
    </div>
  );
};

AllReviewsLink.propTypes = {
  count: PropTypes.number,
  fullWidth: PropTypes.bool,
  productId: PropTypes.string,
};

AllReviewsLink.defaultProps = {
  count: 0,
  fullWidth: false,
  productId: null,
};

export default connect(AllReviewsLink);
