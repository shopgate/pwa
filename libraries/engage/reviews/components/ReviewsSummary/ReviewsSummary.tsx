import { I18n, RatingStars, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { RATING_SCALE_DIVISOR } from '@shopgate/pwa-ui-shared/RatingStars/constants';
import type { ReviewSummary } from '@shopgate/pwa-common-commerce/reviews/types/reviewSummary';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: theme.spacing(1.25),
  },
  average: {
    lineHeight: 1,
  },
}));

export interface ReviewsSummaryProps {
  /** The review summary; nothing renders without an average or with neither rating nor count. */
  summary: ReviewSummary | null;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Displays the average rating and the rating count of a product.
 * @returns The rendered component.
 */
const ReviewsSummary = ({ summary, className }: ReviewsSummaryProps) => {
  const { classes, cx } = useStyles();

  if (!summary || summary.average === null || (!summary.average && !summary.count)) {
    return null;
  }

  return (
    <div className={cx(classes.root, 'engage__reviews__reviews-summary', className)}>
      <Typography
        variant="h1"
        component="span"
        className={cx(classes.average, 'engage__reviews__reviews-summary__average')}
      >
        <I18n.Number number={summary.average / RATING_SCALE_DIVISOR} fractions={1} />
      </Typography>
      <RatingStars value={summary.average} />
      {!!summary.count && (
        <Typography
          variant="caption"
          component="span"
          color="textSecondary"
          className="engage__reviews__reviews-summary__count engage__reviews__rating-count"
        >
          <I18n.Text string="reviews.summary_count" params={{ count: summary.count }} />
        </Typography>
      )}
    </div>
  );
};

export default ReviewsSummary;
