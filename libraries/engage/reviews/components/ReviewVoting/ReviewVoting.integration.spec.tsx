import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import type { Reducer } from 'redux';
import { thunk } from 'redux-thunk';
import { render, screen, fireEvent } from '@testing-library/react';
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import reviewsById from '@shopgate/pwa-common-commerce/reviews/reducers/reviewsById';
import reviewVotes from '@shopgate/pwa-common-commerce/reviews/reducers/reviewVotes';
import { getReviews } from '@shopgate/pwa-common-commerce/reviews/selectors';
import ReviewVoting from './ReviewVoting';

jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => mockedPipelineRequestFactory((
    _mockInstance: unknown,
    resolve: (result?: unknown) => void
  ) => {
    resolve({
      up: 4,
      down: 1,
    });
  })
);

/**
 * Renders the voting of the stored review from the store, as the review card does.
 * @returns The rendered voting.
 */
const ConnectedVoting = () => {
  const { useSelector } = jest.requireActual('react-redux');
  const review = useSelector((state: Parameters<typeof getReviews>[0]) => getReviews(state)[12]);

  return <ReviewVoting review={review} />;
};

describe('<ReviewVoting /> with the review data layer', () => {
  it('should store the vote, update the count and mark the button', async () => {
    const rootReducer = combineReducers({
      reviews: combineReducers({
        reviewsById,
        reviewSettings: () => ({ features: ['reviewRate'] }),
      }),
      reviewVotes,
    }) as unknown as Reducer;

    const store = createStore(
      rootReducer,
      {
        reviews: {
          reviewsById: {
            12: {
              id: 12,
              rate: 80,
              reviewRate: {
                up: 3,
                down: 1,
              },
            },
          },
        },
      },
      applyMiddleware(thunk)
    );

    render(
      <Provider store={store}>
        <ConnectedVoting />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'reviews.vote_up: 3' }));

    const voted = await screen.findByRole('button', { name: 'reviews.vote_up: 4' });
    expect(voted).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'reviews.vote_down: 1' }))
      .toHaveAttribute('aria-disabled', 'true');
    expect(store.getState().reviewVotes).toEqual({ 12: 'up' });
  });
});
