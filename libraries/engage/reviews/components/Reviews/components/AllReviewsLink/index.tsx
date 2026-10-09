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

export interface AllReviewsLinkProps {
  /** The number of reviews of the product; nothing renders up to the preview count. */
  count?: number;
  /** Renders an outlined button over the full width instead of a text button. */
  fullWidth?: boolean;
  /** The id of the product whose review page the link opens. */
  productId?: string | null;
}

/**
 * Link to the review page of a product.
 * @returns The rendered component.
 */
const AllReviewsLink = ({
  count = 0,
  fullWidth = false,
  productId = null,
}: AllReviewsLinkProps) => {
  const { classes, cx } = useStyles();

  if (!productId || count <= REVIEW_PREVIEW_COUNT) {
    return null;
  }

  return (
    <div
      className={cx(
        classes.container,
        { [classes.fullWidth]: fullWidth },
        'engage__reviews__all-reviews-link'
      )}
      data-test-id="showAllReviewsButton"
      data-full-width={fullWidth || undefined}
    >
      <Button
        variant={fullWidth ? 'outlined' : 'text'}
        color="primary"
        fullWidth={fullWidth}
        href={`${ITEM_PATH}/${bin2hex(productId)}/reviews`}
      >
        <I18n.Text string="reviews.button_all" params={{ count }} />
      </Button>
    </div>
  );
};

export default connect(AllReviewsLink);
