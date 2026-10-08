import { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { PRODUCT_REVIEWS } from '@shopgate/engage/product/constants';
import { getBaseProductId, makeIsBaseProductActive } from '@shopgate/engage/product/selectors/product';
import {
  getProductReviewsExcerpt,
  getReviewSummary,
  hasProductReviewsExcerptError,
  isProductReviewsExcerptLoading,
  isProductReviewsExcerptMissing,
} from '@shopgate/pwa-common-commerce/reviews/selectors';
import fetchProductReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchProductReviews';
import { REVIEW_PREVIEW_COUNT } from '@shopgate/pwa-common-commerce/reviews/constants';
import type {
  Review,
  ReviewsConfig,
  ReviewsProductState,
} from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import ReviewsSummary from '../ReviewsSummary';
import ReviewList from '../ReviewList';
import WriteReviewLink from '../Reviews/components/Header/components/WriteReviewLink';
import AllReviewsLink from '../Reviews/components/AllReviewsLink';
import ReviewsInfo from '../Reviews/components/ReviewsInfo';

const EMPTY_REVIEWS: Review[] = [];

const useStyles = makeStyles()(theme => ({
  container: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0, 2),
  },
  writeReview: {
    marginTop: theme.spacing(1),
  },
  info: {
    margin: theme.spacing(0, -2),
  },
}));

export interface ReviewsPreviewProps {
  /** The id of the product whose reviews are previewed; variants resolve to their base product. */
  productId: string;
}

/**
 * Displays the review summary and the review preview of a product on the product page.
 * @returns The rendered component.
 */
const ReviewsPreview = ({ productId }: ReviewsPreviewProps) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch() as unknown as (action: unknown) => void;
  const isBaseProductActive = useMemo(() => makeIsBaseProductActive(), []);

  const { hasReviews, showWriteReview } = appConfig as ReviewsConfig;

  const baseProductId: string = useSelector((state: ReviewsProductState) => (
    getBaseProductId(state, { productId })
  )) || productId;
  const productActive: boolean = useSelector((state: ReviewsProductState) => (
    isBaseProductActive(state, { productId })
  ));
  const summary = useSelector(
    (state: ReviewsProductState) => getReviewSummary(state, { productId: baseProductId }),
    shallowEqual
  );
  const reviews: Review[] = useSelector(
    (state: ReviewsProductState) => getProductReviewsExcerpt(state, { productId: baseProductId }),
    shallowEqual
  ) || EMPTY_REVIEWS;
  const isMissing = useSelector((state: ReviewsProductState) => (
    isProductReviewsExcerptMissing(state, { productId: baseProductId })
  ));
  const isLoading = useSelector((state: ReviewsProductState) => (
    isProductReviewsExcerptLoading(state, { productId: baseProductId })
  ));
  const hasError = useSelector((state: ReviewsProductState) => (
    hasProductReviewsExcerptError(state, { productId: baseProductId })
  ));

  const isVisible = !!hasReviews && productActive;

  useEffect(() => {
    if (isVisible && isMissing) {
      dispatch(fetchProductReviews(baseProductId, REVIEW_PREVIEW_COUNT));
    }
  }, [baseProductId, dispatch, isMissing, isVisible]);

  const handleRetry = useCallback(() => {
    dispatch(fetchProductReviews(baseProductId, REVIEW_PREVIEW_COUNT));
  }, [baseProductId, dispatch]);

  return (
    <SurroundPortals portalName={PRODUCT_REVIEWS} portalProps={{ productId }}>
      {isVisible && (
        <div
          className={cx(
            classes.container,
            'engage__reviews__reviews',
            'engage__reviews__reviews-preview'
          )}
          data-test-id="reviewSection"
        >
          <div id="reviewsExcerpt" className="engage__reviews__reviews-excerpt">
            <ReviewsSummary summary={summary} />
          </div>
          <ReviewList
            reviews={reviews}
            isLoading={isLoading}
            hasError={hasError}
            onRetry={handleRetry}
          />
          <div className="engage__reviews__reviews-preview__actions">
            <AllReviewsLink productId={baseProductId} fullWidth />
            {showWriteReview && (
              <div className={cx(classes.writeReview, 'engage__reviews__reviews-preview__write-review')}>
                <WriteReviewLink productId={baseProductId} fullWidth />
              </div>
            )}
          </div>
          <div className={cx(classes.info, 'engage__reviews__reviews-preview__info')}>
            <ReviewsInfo />
          </div>
        </div>
      )}
    </SurroundPortals>
  );
};

export default ReviewsPreview;
