import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { I18n, Typography } from '@shopgate/engage/components';
import { ButtonBase } from '@shopgate/engage/components/v2';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import submitReviewRate from '@shopgate/pwa-common-commerce/reviews/actions/submitReviewRate';
import { REVIEW_FEATURE_RATE } from '@shopgate/pwa-common-commerce/reviews/constants';
import { getReviewVote, hasReviewFeature } from '@shopgate/pwa-common-commerce/reviews/selectors';
import type {
  Review,
  ReviewVote,
  ReviewVotesState,
} from '@shopgate/pwa-common-commerce/reviews/types/reviews';
import type { ReviewSettingsState } from '@shopgate/pwa-common-commerce/reviews/types/reviewSettings';

type VotingState = ReviewSettingsState & ReviewVotesState;

const ICON_PATHS: Record<ReviewVote, string> = {
  up: 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z',
  down: 'M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z',
};

const LABELS: Record<ReviewVote, string> = {
  up: 'reviews.vote_up',
  down: 'reviews.vote_down',
};

const RATES: ReviewVote[] = ['up', 'down'];

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: theme.spacing(1),
    marginTop: theme.spacing(0.5),
  },
  button: {
    minWidth: 44,
    minHeight: 44,
    color: theme.palette.text.primary,
    fontSize: 13,
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
    },
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 11px',
    border: `1px solid ${theme.components.border.light}`,
    borderRadius: 999,
  },
  blocked: {
    cursor: 'default',
    opacity: 0.5,
  },
  selected: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
    opacity: 1,
    '& > span': {
      borderColor: theme.palette.primary.main,
    },
  },
  error: {
    color: theme.palette.error.main,
  },
}));

export interface ReviewVotingProps {
  /** The review to vote on; its `reviewRate` supplies the displayed counts. */
  review: Review;
}

/**
 * Displays the helpfulness votes of a review and lets the user vote once per review.
 * Renders nothing unless the review provider supports voting.
 * @returns The rendered component.
 */
const ReviewVoting = ({ review }: ReviewVotingProps) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch() as unknown as (action: unknown) => unknown;
  const isSupported = useSelector((state: VotingState) => (
    hasReviewFeature(state, REVIEW_FEATURE_RATE)
  ));
  const vote = useSelector((state: VotingState) => getReviewVote(state, review.id));
  const [isPending, setIsPending] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  if (!isSupported) {
    return null;
  }

  const isBlocked = !!vote || isPending;

  /**
   * @param rate The vote of the user.
   */
  const handleVote = (rate: ReviewVote) => {
    if (isBlocked) {
      return;
    }

    setIsPending(true);
    setHasError(false);

    Promise.resolve(dispatch(submitReviewRate(review.id, rate)))
      .then(() => false, () => true)
      .then((failed) => {
        if (isMounted.current) {
          setIsPending(false);
          setHasError(failed);
        }
      });
  };

  return (
    <div className={cx(classes.root, 'engage__reviews__review-voting')}>
      <Typography
        variant="caption"
        component="span"
        color="textSecondary"
      >
        <I18n.Text string="reviews.vote_question" />
      </Typography>
      {RATES.map((rate) => {
        const count = review.reviewRate?.[rate];
        const hasCount = typeof count === 'number';
        const label = i18n.text(LABELS[rate]);

        return (
          <ButtonBase
            key={rate}
            className={cx(classes.button, {
              [classes.blocked]: isBlocked,
              [classes.selected]: vote === rate,
            }, `engage__reviews__review-voting__${rate}`)}
            aria-label={hasCount ? `${label}: ${count}` : label}
            aria-pressed={vote === rate}
            aria-disabled={isBlocked}
            disableRipple={isBlocked}
            onClick={() => handleVote(rate)}
          >
            <span className={classes.pill}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path d={ICON_PATHS[rate]} />
              </svg>
              {hasCount && count}
            </span>
          </ButtonBase>
        );
      })}
      <Typography
        variant="caption"
        component="span"
        color="textSecondary"
        role="status"
        className={cx({ [classes.error]: hasError }, 'engage__reviews__review-voting__status')}
      >
        {isPending && <I18n.Text string="reviews.vote_pending" />}
        {hasError && <I18n.Text string="reviews.vote_error" />}
      </Typography>
    </div>
  );
};

export default ReviewVoting;
