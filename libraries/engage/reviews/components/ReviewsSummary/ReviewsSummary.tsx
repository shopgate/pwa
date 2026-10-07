import { useRef } from 'react';
import {
  I18n, PlaceholderLabel, RatingStars, Typography,
} from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { RATING_SCALE_DIVISOR } from '@shopgate/pwa-ui-shared/RatingStars/constants';
import type { ReviewSummary } from '@shopgate/pwa-common-commerce/reviews/types/reviewSummary';

const STARS = ['5', '4', '3', '2', '1'] as const;

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1.25),
  },
  average: {
    lineHeight: 1,
  },
  rating: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
  },
  placeholder: {
    width: '60%',
    height: 34,
    marginBottom: 0,
  },
  distribution: {
    flex: '1 0 100%',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 28,
  },
  label: {
    flex: '0 0 6em',
    whiteSpace: 'nowrap',
  },
  bar: {
    flex: '1 1 auto',
    margin: theme.spacing(0, 1.5),
    height: 8,
    borderRadius: 4,
    background: theme.components.border.light,
    overflow: 'hidden',
  },
  fill: {
    display: 'block',
    height: '100%',
    borderRadius: 4,
    background: theme.palette.primary.main,
  },
  count: {
    flex: '0 0 3.5em',
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'right',
  },
}));

export interface ReviewsSummaryProps {
  /** The review summary; nothing renders without an average or with neither rating nor count. */
  summary: ReviewSummary | null;
  /** Whether a summary is still expected; shows a placeholder until the first response. */
  isLoading?: boolean;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Displays the average rating and the rating count of a product, and the number of ratings
 * per number of stars when the summary has a distribution.
 * @returns The rendered component.
 */
const ReviewsSummary = ({ summary, isLoading = false, className }: ReviewsSummaryProps) => {
  const { classes, cx } = useStyles();
  const wasLoaded = useRef(false);

  if (!isLoading) {
    wasLoaded.current = true;
  }

  if (!summary || summary.average === null || (!summary.average && !summary.count)) {
    return isLoading && !wasLoaded.current ? (
      <PlaceholderLabel
        className={cx(classes.placeholder, 'engage__reviews__reviews-summary__placeholder')}
      />
    ) : null;
  }

  const { distribution } = summary;
  const total = distribution
    ? STARS.reduce((sum, stars) => sum + distribution[stars], 0)
    : 0;

  return (
    <div className={cx(classes.root, 'engage__reviews__reviews-summary', className)}>
      <Typography
        variant="h1"
        component="span"
        className={cx(classes.average, 'engage__reviews__reviews-summary__average')}
      >
        <I18n.Number number={summary.average / RATING_SCALE_DIVISOR} fractions={1} />
      </Typography>
      <div className={cx(classes.rating, 'engage__reviews__reviews-summary__rating')}>
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
      {distribution && (
        <ul className={cx(classes.distribution, 'engage__reviews__reviews-summary__distribution')}>
          {STARS.map(stars => (
            <li
              key={stars}
              className={cx(classes.row, 'engage__reviews__reviews-summary__distribution-row')}
              data-stars={stars}
            >
              <Typography variant="caption" component="span" className={classes.label}>
                <I18n.Text string={`reviews.filter_rate_${stars}`} />
              </Typography>
              <span className={classes.bar} aria-hidden="true">
                <span
                  className={cx(classes.fill, 'engage__reviews__reviews-summary__distribution-fill')}
                  style={{ width: `${total > 0 ? (distribution[stars] / total) * 100 : 0}%` }}
                />
              </span>
              <Typography
                variant="caption"
                component="span"
                color="textSecondary"
                className={classes.count}
              >
                {distribution[stars]}
              </Typography>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsSummary;
