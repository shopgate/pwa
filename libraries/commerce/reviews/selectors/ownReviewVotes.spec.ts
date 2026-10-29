import { getOwnReviewVote } from './ownReviewVotes';

describe('Reviews selectors: getOwnReviewVote', () => {
  it('should return the vote for a review id of any type', () => {
    const state = { ownReviewVotes: { 12: 'up' as const } };

    expect(getOwnReviewVote(state, 12)).toBe('up');
    expect(getOwnReviewVote(state, '12')).toBe('up');
  });

  it('should return null without a vote or without the slice', () => {
    expect(getOwnReviewVote({ ownReviewVotes: {} }, 12)).toBeNull();
    expect(getOwnReviewVote({}, 12)).toBeNull();
  });
});
