import { Fragment, useState } from 'react';
import { I18n, RatingStars, Typography } from '@shopgate/engage/components';
import { ButtonBase } from '@shopgate/engage/components/v2';
import { keyframes, makeStyles } from '@shopgate/engage/styles';
import type { Review } from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import ReviewMedia from '../ReviewMedia';
import ReviewVoting from '../ReviewVoting';

/**
 * Converts a date string into a timestamp.
 * @param date An ISO date string.
 * @returns The timestamp, or null when the date is missing or invalid.
 */
const toTimestamp = (date?: string): number | null => {
  const timestamp = date ? new Date(date).getTime() : NaN;
  return Number.isFinite(timestamp) ? timestamp : null;
};

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const useStyles = makeStyles()(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  verified: {
    padding: '2px 7px',
    borderRadius: 999,
    background: theme.palette.primary.main,
    color: theme.contrastColor(theme.palette.primary.main),
    fontSize: 11,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.5,
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
    marginTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(1.5),
    borderLeft: `2px solid ${theme.components.border.light}`,
  },
  replyToggle: {
    justifyContent: 'flex-start',
    minHeight: 44,
    padding: 0,
    color: theme.palette.primary.main,
    fontSize: 13,
    fontWeight: theme.typography.fontWeightBold,
    textAlign: 'left',
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
    },
  },
  replyContent: {
    paddingBottom: theme.spacing(0.5),
    animation: `${fadeIn} 150ms ease-out`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
  replyText: {
    whiteSpace: 'pre-line',
    overflowWrap: 'anywhere',
  },
  replyMeta: {
    marginTop: theme.spacing(0.5),
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
  const [isReplyOpen, setIsReplyOpen] = useState(false);
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
          <span className={cx(classes.verified, 'engage__reviews__review-card__verified')}>
            <I18n.Text string="reviews.verified" />
          </span>
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
          <ButtonBase
            className={cx(classes.replyToggle, 'engage__reviews__review-card__reply-toggle')}
            aria-expanded={isReplyOpen}
            onClick={() => setIsReplyOpen(isOpen => !isOpen)}
          >
            <I18n.Text
              string={isReplyOpen ? 'reviews.merchant_reply' : 'reviews.merchant_reply_show'}
            />
          </ButtonBase>
          {isReplyOpen && (
            <div className={classes.replyContent}>
              <Typography
                variant="body2"
                component="div"
                className={cx(classes.replyText, 'engage__reviews__review-card__reply-text')}
              >
                {reply}
              </Typography>
              {(replyAuthor || replyTimestamp !== null) && (
                <Typography
                  variant="caption"
                  component="div"
                  color="textSecondary"
                  className={cx(classes.replyMeta, 'engage__reviews__review-card__reply-meta')}
                >
                  {replyAuthor}
                  {replyAuthor && replyTimestamp !== null && ' · '}
                  {replyTimestamp !== null && (
                    <I18n.Date timestamp={replyTimestamp} format="long" />
                  )}
                </Typography>
              )}
            </div>
          )}
        </div>
      )}
      <ReviewVoting review={review} />
    </div>
  );
};

export default ReviewCard;
