import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { BackBar } from 'Components/AppBar/presets';
// eslint-disable-next-line import/named
import { mockedState } from './mock';
import ReviewForm from './components/ReviewForm';
import { UnwrappedWriteReview } from './index';

jest.mock('@shopgate/engage/components');
jest.mock('Components/AppBar/presets', () => ({
  BackBar: jest.fn(() => null),
}));
jest.mock('./components/ReviewForm', () => jest.fn(() => null));
const mockedStore = configureStore();

describe('<WriteReview> page', () => {
  it('should not crash', () => {
    render((
      <Provider store={mockedStore(mockedState)}>
        <UnwrappedWriteReview productId="foo" visible />
      </Provider>
    ));

    expect(BackBar.mock.lastCall[0]).toEqual(expect.objectContaining({ title: 'titles.reviews' }));
    expect(ReviewForm.mock.lastCall[0]).toEqual({ productId: 'foo' });
  });
});
