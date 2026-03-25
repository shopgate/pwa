import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { I18n } from '@shopgate/engage/components';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import { REVIEW_PREVIEW_COUNT } from '@shopgate/pwa-common-commerce/reviews/constants';
import ButtonLink from '@shopgate/pwa-ui-shared/ButtonLink';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './connector';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    textAlign: 'right',
    marginTop: -variables.gap.small,
    marginBottom: -variables.gap.big,
  },
});

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AllReviewsLink = (props) => {
  const { classes } = useStyles();

  if (!props.productId || props.count <= REVIEW_PREVIEW_COUNT) {
    return null;
  }

  return (
    <div className={`${classes.container} engage__reviews__all-reviews-link`} data-test-id="showAllReviewsButton">
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
