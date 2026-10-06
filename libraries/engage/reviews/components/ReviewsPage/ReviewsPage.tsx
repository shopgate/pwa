import { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import { getProductIsFetching } from '@shopgate/engage/product/selectors/product';
import { getBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  getProductReviews,
  getReviewListRequestOffset,
  getReviewsFetchingState,
  getReviewsTotalCount,
  getReviewSummary,
  hasReviewListError,
  isReviewListLoading,
  isReviewListMissing,
} from '@shopgate/pwa-common-commerce/reviews/selectors';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import { REVIEW_ITEMS_PER_PAGE } from '@shopgate/pwa-common-commerce/reviews/constants';
import { PRODUCT_REVIEWS_ALL } from '@shopgate/pwa-common-commerce/reviews/constants/Portals';
import type { Review, ReviewsState } from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import ReviewsSummary from '../ReviewsSummary';
import ReviewList from '../ReviewList';
import WriteReviewLink from '../Reviews/components/Header/components/WriteReviewLink';
import ReviewsInfo from '../Reviews/components/ReviewsInfo';

type PageState = ReviewsState & { product: unknown };

type ReviewsConfig = {
  showWriteReview?: boolean;
};

const useStyles = makeStyles()(theme => ({
  summary: {
    padding: theme.spacing(2, 2, 0),
  },
  list: {
    padding: theme.spacing(0, 2),
  },
  loadMore: {
    margin: theme.spacing(1, 0),
    padding: theme.spacing(0, 2),
    textAlign: 'center',
  },
  actions: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(0, 2),
  },
}));

export interface ReviewsPageProps {
  /** The product id of the review route; variants resolve to their base product. */
  productId: string;
}

/**
 * Displays the review summary and the paginated review list of a product on the review page.
 * @returns The rendered component.
 */
const ReviewsPage = ({ productId }: ReviewsPageProps) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch() as unknown as (action: unknown) => void;

  const { showWriteReview } = appConfig as ReviewsConfig;

  const listProps = useMemo(() => ({
    productId,
    variantId: null,
  }), [productId]);

  const baseProductId: string = useSelector((state: PageState) => (
    getBaseProductId(state, listProps)
  )) || productId;
  const isProductFetching: boolean = useSelector((state: PageState) => (
    getProductIsFetching(state, listProps)
  ));
  const summary = useSelector(
    (state: PageState) => getReviewSummary(state, { productId: baseProductId }),
    shallowEqual
  );
  const reviews: Review[] = useSelector(
    (state: PageState) => getProductReviews(state, listProps),
    shallowEqual
  );
  const totalCount = useSelector((state: PageState) => getReviewsTotalCount(state, listProps));
  const requestOffset = useSelector((state: PageState) => (
    getReviewListRequestOffset(state, listProps)
  ));
  const isMissing = useSelector((state: PageState) => isReviewListMissing(state, listProps));
  const isLoading = useSelector((state: PageState) => isReviewListLoading(state, listProps));
  const isFetching = !!useSelector((state: PageState) => (
    getReviewsFetchingState(state, listProps)
  ));
  const hasError = useSelector((state: PageState) => hasReviewListError(state, listProps));

  useEffect(() => {
    if (isMissing && !isProductFetching) {
      dispatch(fetchReviews(baseProductId, REVIEW_ITEMS_PER_PAGE));
    }
  }, [baseProductId, dispatch, isMissing, isProductFetching]);

  const handleRetry = useCallback(() => {
    dispatch(fetchReviews(baseProductId, REVIEW_ITEMS_PER_PAGE, requestOffset));
  }, [baseProductId, dispatch, requestOffset]);

  const handleLoadMore = useCallback(() => {
    dispatch(fetchReviews(baseProductId, REVIEW_ITEMS_PER_PAGE, reviews.length));
  }, [baseProductId, dispatch, reviews.length]);

  const canLoadMore = !hasError
    && reviews.length > 0
    && typeof totalCount === 'number'
    && reviews.length < totalCount;

  return (
    <SurroundPortals portalName={PRODUCT_REVIEWS_ALL} portalProps={{ productId }}>
      <div className={cx(classes.summary, 'engage__reviews__reviews-excerpt')}>
        <ReviewsSummary summary={summary} />
      </div>
      <ReviewList
        className={classes.list}
        reviews={reviews}
        isLoading={isLoading}
        hasError={hasError}
        onRetry={handleRetry}
        totalCount={totalCount}
      />
      {canLoadMore && (
        <div className={cx(classes.loadMore, 'engage__reviews__reviews-page__load-more')}>
          <Button
            variant="text"
            color="secondary"
            onClick={handleLoadMore}
            loading={isFetching}
          >
            <I18n.Text string="common.load_more" />
          </Button>
        </div>
      )}
      {showWriteReview && (
        <div className={cx(classes.actions, 'engage__reviews__reviews-page__actions')}>
          <WriteReviewLink productId={baseProductId} fullWidth />
        </div>
      )}
      <ReviewsInfo />
    </SurroundPortals>
  );
};

export default ReviewsPage;
