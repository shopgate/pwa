import receiveReviewVote from '../action-creators/receiveReviewVote';
import reviewsById from './reviewsById';
import ownReviewVotes from './ownReviewVotes';

describe('Reviews reducers: review vote', () => {
  describe('ownReviewVotes', () => {
    it('should start empty', () => {
      expect(ownReviewVotes(undefined, { type: '@@init' })).toEqual({});
    });

    it('should store the vote by review id and keep other votes', () => {
      const state = ownReviewVotes({ a: 'down' }, receiveReviewVote(12, 'up', {
        up: 1,
        down: 0,
      }));

      expect(state).toEqual({
        a: 'down',
        12: 'up',
      });
    });

    it('should ignore other actions', () => {
      const state = { a: 'down' as const };

      expect(ownReviewVotes(state, { type: 'RESET_APP' })).toBe(state);
    });
  });

  describe('reviewsById', () => {
    it('should update the vote counts of a stored review', () => {
      const state = reviewsById({
        12: {
          id: 12,
          rate: 80,
          title: 'Great',
          reviewVotes: {
            up: 1,
            down: 0,
          },
        },
      }, receiveReviewVote(12, 'up', {
        up: 2,
        down: 0,
      }));

      expect(state[12]).toEqual({
        id: 12,
        rate: 80,
        title: 'Great',
        reviewVotes: {
          up: 2,
          down: 0,
        },
      });
    });

    it('should not create an entry for an unknown review', () => {
      const state = {};

      expect(reviewsById(state, receiveReviewVote('x', 'down', {
        up: 0,
        down: 1,
      }))).toBe(state);
    });
  });
});
