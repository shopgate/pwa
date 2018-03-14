import { mockedStateWithoutReview } from 'Components/Reviews/mock';

export const mockedState = {
  ...mockedStateWithoutReview,
  reviews: {
    reviewsByHash: {},
  },
  history: {
    state: {
      title: '',
      viewTop: true,
    },
  },
};
