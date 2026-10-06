import { Fragment } from 'react';
import { I18n, RatingStars, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import CheckIcon from '@shopgate/pwa-ui-shared/icons/CheckIcon';
import type { Review } from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import ReviewMedia from '../ReviewMedia';

/**
 * Converts a date string into a timestamp.
 * @param date An ISO date string.
 * @returns The timestamp, or null when the date is missing or invalid.
 */
const toTimestamp = (date?: string): number | null => {
  const timestamp = date ? new Date(date).getTime() : NaN;
  return Number.isFinite(timestamp) ? timestamp : null;
};

const useStyles = makeStyles()(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  verified: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  verifiedIcon: {
    color: theme.palette.success.main,
    '& path': {
      stroke: 'currentColor',
    },
  },
  title: {
    marginTop: theme.spacing(1),
  },
  text: {
    marginTop: theme.spacing(0.75),
    whiteSpace: 'pre-line',
    overflowWrap: 'anywhere',
  },
  customFields: {
    display: 'grid',
    gridTemplateColumns: 'fit-content(40%) minmax(0, 1fr)',
    columnGap: theme.spacing(1),
    rowGap: theme.spacing(0.25),
    margin: theme.spacing(1, 0, 0),
    overflowWrap: 'anywhere',
  },
  customFieldValue: {
    margin: 0,
  },
  meta: {
    marginTop: theme.spacing(1),
  },
  reply: {
    marginTop: theme.spacing(1.5),
    paddingLeft: theme.spacing(1.5),
    borderLeft: `2px solid ${theme.components.border.light}`,
  },
}));

export interface ReviewCardProps {
  /** The review to display; missing optional fields are omitted. */
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
  const timestamp = toTimestamp(review.date);
  const title = review.title?.trim();
  const text = review.review?.trim();
  const author = review.author?.trim();
  const customFields = (review.customFields || [])
    .filter(field => field?.label?.trim() && field?.value?.trim());
  const reply = review.merchantReply?.reply?.trim();
  const replyAuthor = review.merchantReply?.author?.trim();
  const replyTimestamp = toTimestamp(review.merchantReply?.date);

  return (
    <div className={cx('engage__reviews__review-card', className)}>
      <div className={classes.header}>
        <RatingStars value={review.rate} />
        {review.isVerified === true && (
          <Typography
            variant="caption"
            component="span"
            color="textSecondary"
            className={cx(classes.verified, 'engage__reviews__review-card__verified')}
          >
            <CheckIcon size={14} className={classes.verifiedIcon} />
            <I18n.Text string="reviews.verified" />
          </Typography>
        )}
      </div>
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
      <ReviewMedia media={review.media} />
      {customFields.length > 0 && (
        <Typography
          variant="caption"
          component="dl"
          className={cx(classes.customFields, 'engage__reviews__review-card__custom-fields')}
        >
          {customFields.map((field, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={`${index}-${field.label}`}>
              <Typography variant="caption" component="dt" color="textSecondary">
                {field.label}
              </Typography>
              <dd className={classes.customFieldValue}>{field.value}</dd>
            </Fragment>
          ))}
        </Typography>
      )}
      {(author || timestamp !== null) && (
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
          className={cx(classes.meta, 'engage__reviews__review-card__meta')}
        >
          {author}
          {author && timestamp !== null && ' · '}
          {timestamp !== null && <I18n.Date timestamp={timestamp} format="long" />}
        </Typography>
      )}
      {reply && (
        <div className={cx(classes.reply, 'engage__reviews__review-card__reply')}>
          <Typography variant="caption" component="div" color="textSecondary">
            {replyAuthor
              ? <I18n.Text string="reviews.merchant_reply" params={{ author: replyAuthor }} />
              : <I18n.Text string="reviews.merchant_reply_default" />}
            {replyTimestamp !== null && ' · '}
            {replyTimestamp !== null && <I18n.Date timestamp={replyTimestamp} format="long" />}
          </Typography>
          <Typography
            variant="body2"
            component="div"
            className={cx(classes.text, 'engage__reviews__review-card__reply-text')}
          >
            {reply}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
