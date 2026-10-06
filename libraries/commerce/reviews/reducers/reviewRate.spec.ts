import receiveReviewRate from '../action-creators/receiveReviewRate';
import reviewsById from './reviewsById';
import reviewVotes from './reviewVotes';

describe('Reviews reducers: review rate', () => {
  describe('reviewVotes', () => {
    it('should start empty', () => {
      expect(reviewVotes(undefined, { type: '@@init' })).toEqual({});
    });

    it('should store the vote by review id and keep other votes', () => {
      const state = reviewVotes({ a: 'down' }, receiveReviewRate(12, 'up', {
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

      expect(reviewVotes(state, { type: 'RESET_APP' })).toBe(state);
    });
  });

  describe('reviewsById', () => {
    it('should update the vote counts of a stored review', () => {
      const state = reviewsById({
        12: {
          id: 12,
          rate: 80,
          title: 'Great',
          reviewRate: {
            up: 1,
            down: 0,
          },
        },
      }, receiveReviewRate(12, 'up', {
        up: 2,
        down: 0,
      }));

      expect(state[12]).toEqual({
        id: 12,
        rate: 80,
        title: 'Great',
        reviewRate: {
          up: 2,
          down: 0,
        },
      });
    });

    it('should not create an entry for an unknown review', () => {
      const state = {};

      expect(reviewsById(state, receiveReviewRate('x', 'down', {
        up: 0,
        down: 1,
      }))).toBe(state);
    });
  });
});
