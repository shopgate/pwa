import { getReviewVote } from './reviewVotes';

describe('Reviews selectors: getReviewVote', () => {
  it('should return the vote for a review id of any type', () => {
    const state = { reviewVotes: { 12: 'up' as const } };

    expect(getReviewVote(state, 12)).toBe('up');
    expect(getReviewVote(state, '12')).toBe('up');
  });

  it('should return null without a vote or without the slice', () => {
    expect(getReviewVote({ reviewVotes: {} }, 12)).toBeNull();
    expect(getReviewVote({}, 12)).toBeNull();
  });
});
