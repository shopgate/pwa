import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen } from '@testing-library/react';
import { mockedStateWithAll } from '@shopgate/pwa-common-commerce/reviews/mock';
import LoadMore from './components/LoadMore';
import { UnwrappedReviews as Reviews } from './index';

const mockedStore = configureStore();
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/reviews/components/Reviews/components/Header', () => () => 'div');
jest.mock('Components/AppBar/presets', () => ({
  BackBar: () => '<BackBar />',
}));
jest.mock('./components/LoadMore', () => jest.fn(() => null));

describe('<Reviews> page', () => {
  it('should not crash', () => {
    render((
      <Provider store={mockedStore(mockedStateWithAll)}>
        <Reviews id="foo" />
      </Provider>
    ));

    expect(screen.getByText('<BackBar />', { exact: false })).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: 'reviews.rating_stars' })).toHaveLength(4);
    expect(LoadMore.mock.lastCall[0]).toEqual({ productId: 'foo' });
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });
});
