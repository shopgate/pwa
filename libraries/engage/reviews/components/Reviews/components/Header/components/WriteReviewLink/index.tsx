import { I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { Button } from '@shopgate/engage/components/v2';

export interface WriteReviewLinkProps {
  /** The id of the product to review. */
  productId: string;
  /** Renders the button over the full width. */
  fullWidth?: boolean;
}

/**
 * Link to add a review.
 * @returns The rendered component.
 */
const WriteReviewLink = ({ productId, fullWidth = false }: WriteReviewLinkProps) => (
  <div
    data-test-id="writeReview"
    className="engage__reviews__write-review-link"
    data-full-width={fullWidth || undefined}
  >
    <Button
      variant="text"
      color="primary"
      fullWidth={fullWidth}
      href={`${ITEM_PATH}/${bin2hex(productId)}/write_review`}
      aria-label={i18n.text('reviews.button_add')}
    >
      <I18n.Text string="reviews.button_add" />
    </Button>
  </div>
);

export default WriteReviewLink;
