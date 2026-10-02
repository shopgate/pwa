import { I18n, RatingStars, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import type { Review } from '@shopgate/pwa-common-commerce/reviews/types/reviews';

const useStyles = makeStyles()(theme => ({
  title: {
    marginTop: theme.spacing(1),
  },
  text: {
    marginTop: theme.spacing(0.75),
    whiteSpace: 'pre-line',
    overflowWrap: 'anywhere',
  },
  meta: {
    marginTop: theme.spacing(1),
  },
}));

export interface ReviewCardProps {
  /** The review to display; missing title, text, author or date are omitted. */
  review: Review;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Displays a single product review.
 * @returns The rendered component.
 */
const ReviewCard = ({ review, className }: ReviewCardProps) => {
  const { classes, cx } = useStyles();
  const timestamp = review.date ? new Date(review.date).getTime() : NaN;
  const hasDate = Number.isFinite(timestamp);
  const title = review.title?.trim();
  const text = review.review?.trim();
  const author = review.author?.trim();

  return (
    <div className={cx('engage__reviews__review-card', className)}>
      <RatingStars value={review.rate} />
      {title && (
        <Typography
          variant="body1"
          fontWeight="medium"
          className={cx(classes.title, 'engage__reviews__review-card__title')}
        >
          {title}
        </Typography>
      )}
      {text && (
        <Typography
          variant="body2"
          component="div"
          className={cx(classes.text, 'engage__reviews__review-card__text')}
        >
          {text}
        </Typography>
      )}
      {(author || hasDate) && (
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
          className={cx(classes.meta, 'engage__reviews__review-card__meta')}
        >
          {author}
          {author && hasDate && ' · '}
          {hasDate && <I18n.Date timestamp={timestamp} format="long" />}
        </Typography>
      )}
    </div>
  );
};

export default ReviewCard;
