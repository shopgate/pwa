import { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import { getBaseProductId, getProductIsFetching } from '@shopgate/engage/product/selectors/product';
import {
  getProductReviews,
  getReviewListFilterMedia,
  getReviewListRequestOffset,
  getReviewListSort,
  getReviewsFetchingState,
  getReviewSortOptions,
  getReviewsTotalCount,
  getReviewSummary,
  hasMoreReviews,
  hasReviewFeature,
  hasReviewListError,
  isReviewListLoading,
  isReviewListMissing,
  isReviewListQueryChanged,
} from '@shopgate/pwa-common-commerce/reviews/selectors';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import {
  REVIEW_FEATURE_MEDIA_FILTER,
  REVIEW_ITEMS_PER_PAGE,
} from '@shopgate/pwa-common-commerce/reviews/constants';
import { PRODUCT_REVIEWS_ALL } from '@shopgate/pwa-common-commerce/reviews/constants/Portals';
import type {
  Review,
  ReviewsConfig,
  ReviewsProductState,
} from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import ReviewsSummary from '../ReviewsSummary';
import ReviewList from '../ReviewList';
import ReviewsToolbar from '../ReviewsToolbar';
import WriteReviewLink from '../Reviews/components/Header/components/WriteReviewLink';
import ReviewsInfo from '../Reviews/components/ReviewsInfo';

const EMPTY_REVIEWS: Review[] = [];

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

  const baseProductId: string = useSelector((state: ReviewsProductState) => (
    getBaseProductId(state, listProps)
  )) || productId;
  const isProductFetching: boolean = useSelector((state: ReviewsProductState) => (
    getProductIsFetching(state, listProps)
  ));
  const summary = useSelector(
    (state: ReviewsProductState) => getReviewSummary(state, { productId: baseProductId }),
    shallowEqual
  );
  const reviews: Review[] = useSelector(
    (state: ReviewsProductState) => getProductReviews(state, listProps),
    shallowEqual
  );
  const totalCount = useSelector((state: ReviewsProductState) => (
    getReviewsTotalCount(state, listProps)
  ));
  const requestOffset = useSelector((state: ReviewsProductState) => (
    getReviewListRequestOffset(state, listProps)
  ));
  const isMissing = useSelector((state: ReviewsProductState) => (
    isReviewListMissing(state, listProps)
  ));
  const isLoading = useSelector((state: ReviewsProductState) => (
    isReviewListLoading(state, listProps)
  ));
  const isFetching = !!useSelector((state: ReviewsProductState) => (
    getReviewsFetchingState(state, listProps)
  ));
  const hasError = useSelector((state: ReviewsProductState) => (
    hasReviewListError(state, listProps)
  ));
  const hasMore = useSelector((state: ReviewsProductState) => hasMoreReviews(state, listProps));
  const sort = useSelector((state: ReviewsProductState) => getReviewListSort(state, listProps));
  const filterMedia = useSelector((state: ReviewsProductState) => (
    getReviewListFilterMedia(state, listProps)
  ));
  const isQueryChanged = useSelector((state: ReviewsProductState) => (
    isReviewListQueryChanged(state, listProps)
  ));
  const sortOptions = useSelector(getReviewSortOptions, shallowEqual);
  const isMediaFilterAvailable = useSelector((state: ReviewsProductState) => (
    hasReviewFeature(state, REVIEW_FEATURE_MEDIA_FILTER)
  ));

  useEffect(() => {
    if (isMissing && !isProductFetching) {
      dispatch(fetchReviews(baseProductId, REVIEW_ITEMS_PER_PAGE));
    }
  }, [baseProductId, dispatch, isMissing, isProductFetching]);

  const requestReviews = useCallback((
    offset: number,
    nextSort: string,
    nextFilterMedia: boolean
  ) => {
    dispatch(fetchReviews(
      baseProductId,
      REVIEW_ITEMS_PER_PAGE,
      offset,
      nextSort,
      nextFilterMedia
    ));
  }, [baseProductId, dispatch]);

  const handleRetry = useCallback(() => {
    requestReviews(requestOffset, sort, filterMedia);
  }, [filterMedia, requestOffset, requestReviews, sort]);

  const handleLoadMore = useCallback(() => {
    requestReviews(reviews.length, sort, filterMedia);
  }, [filterMedia, requestReviews, reviews.length, sort]);

  const handleSortChange = useCallback((nextSort: string) => {
    if (nextSort !== sort) {
      requestReviews(0, nextSort, filterMedia);
    }
  }, [filterMedia, requestReviews, sort]);

  const handleFilterMediaChange = useCallback((nextFilterMedia: boolean) => {
    requestReviews(0, sort, nextFilterMedia);
  }, [requestReviews, sort]);

  const canLoadMore = !hasError && hasMore && !isQueryChanged;

  return (
    <SurroundPortals portalName={PRODUCT_REVIEWS_ALL} portalProps={{ productId }}>
      <div className={cx(classes.summary, 'engage__reviews__reviews-excerpt')}>
        <ReviewsSummary summary={summary} />
        {!isMissing && (
          <ReviewsToolbar
            sort={sort}
            sortOptions={sortOptions}
            filterMedia={filterMedia}
            isMediaFilterAvailable={isMediaFilterAvailable}
            onSortChange={handleSortChange}
            onFilterMediaChange={handleFilterMediaChange}
          />
        )}
      </div>
      <ReviewList
        className={classes.list}
        reviews={isQueryChanged ? EMPTY_REVIEWS : reviews}
        isLoading={isLoading}
        hasError={hasError}
        onRetry={handleRetry}
        totalCount={isQueryChanged ? null : totalCount}
        isFiltered={filterMedia}
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
