import { I18n, SurroundPortals, Typography } from '@shopgate/engage/components';
import { Button, CircularProgress } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import { PRODUCT_REVIEWS_ENTRY } from '@shopgate/engage/product/constants';
import type { Review } from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import ReviewCard from '../ReviewCard';

const useStyles = makeStyles()(theme => ({
  count: {
    display: 'block',
    marginTop: theme.spacing(1.25),
  },
  list: {
    listStyle: 'none',
    margin: theme.spacing(2, 0, 0),
    padding: 0,
    borderTop: `1px solid ${theme.components.border.light}`,
  },
  item: {
    padding: theme.spacing(2.25, 0),
    borderBottom: `1px solid ${theme.components.border.light}`,
  },
  state: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(3.5, 0),
    textAlign: 'center',
  },
}));

type ReviewListState = 'loading' | 'error' | 'empty' | 'ready';

export interface ReviewListProps {
  /** The reviews to display, in the order returned by the pipeline. */
  reviews: Review[];
  /** Whether reviews are being loaded; keep it set until the first response. */
  isLoading?: boolean;
  /** Whether the last request failed. */
  hasError?: boolean;
  /** Called when the user retries after an error. */
  onRetry?: () => void;
  /** Number of reviews in the list result; differs from the summary rating count. */
  totalCount?: number | null;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Displays a list of product reviews with loading, empty and error states.
 * @returns The rendered component.
 */
const ReviewList = ({
  reviews,
  isLoading = false,
  hasError = false,
  onRetry,
  totalCount,
  className,
}: ReviewListProps) => {
  const { classes, cx } = useStyles();
  const hasReviews = reviews.length > 0;
  const showError = hasError && !isLoading;

  let state: ReviewListState = 'ready';

  if (showError) {
    state = 'error';
  } else if (!hasReviews) {
    state = isLoading ? 'loading' : 'empty';
  }

  return (
    <div
      className={cx('engage__reviews__review-list', className)}
      data-state={state}
      aria-busy={isLoading || undefined}
    >
      {hasReviews && !!totalCount && totalCount > 0 && (
        <Typography
          variant="caption"
          color="textSecondary"
          className={cx(classes.count, 'engage__reviews__review-list__count')}
        >
          <I18n.Text string="reviews.list_count" params={{ count: totalCount }} />
        </Typography>
      )}
      {hasReviews && (
        <ul className={cx(classes.list, 'engage__reviews__list')}>
          {reviews.map(review => (
            <li
              key={review.id}
              className={cx(classes.item, 'engage__reviews__review-list__item')}
              data-test-id={`reviewTitle: ${review.title}`}
            >
              <SurroundPortals portalName={PRODUCT_REVIEWS_ENTRY} portalProps={{ review }}>
                <ReviewCard review={review} />
              </SurroundPortals>
            </li>
          ))}
        </ul>
      )}
      {state === 'loading' && (
        <div className={cx(classes.state, 'engage__reviews__review-list__loading')}>
          <CircularProgress />
        </div>
      )}
      {state === 'empty' && (
        <Typography
          component="div"
          color="textSecondary"
          className={cx(classes.state, 'engage__reviews__review-list__empty')}
        >
          <I18n.Text string="reviews.list_empty" />
        </Typography>
      )}
      {showError && (
        <div className={cx(classes.state, 'engage__reviews__review-list__error')}>
          <Typography color="textSecondary" role="alert">
            <I18n.Text string="common.errors.generic" />
          </Typography>
          {onRetry && (
            <Button variant="text" color="primary" onClick={onRetry}>
              <I18n.Text string="reviews.button_retry" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
