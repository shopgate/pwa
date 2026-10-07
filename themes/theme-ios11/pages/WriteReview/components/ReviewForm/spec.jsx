import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import {
  mockProductId,
  mockedStateWithoutReview,
  mockedStateWithInvalidReview,
  mockedStateWithReview,
  mockedStateWithUserReviewLoading,
  mockedStateWithoutProductData,
} from '../../mock';
import ReviewForm from './index';

const mockedStore = configureStore();

jest.mock('@shopgate/pwa-common/helpers/router', () => ({
  getCurrentRoute: jest.fn(),
}));

jest.mock('@shopgate/engage/components');

/**
 * Renders the component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @param {Function} dispatchSpy Dispatch spy
 * @return {Object}
 */
const renderComponent = (mockedState, dispatchSpy = jest.fn()) => {
  const store = mockedStore(mockedState);
  store.dispatch = dispatchSpy;

  return render((
    <Provider store={store}>
      <LoadingProvider>
        <ReviewForm submit={() => { }} productId={mockProductId} />
      </LoadingProvider>
    </Provider>
  ));
};

const getAuthor = () => screen.getByLabelText('reviews.review_form_author');
const getTitle = () => screen.getByLabelText('reviews.review_form_title');
const getReview = () => screen.getByLabelText('reviews.review_form_text');
const getRatingButtons = () => screen.getAllByRole('button', {
  name: 'reviews.press_to_rate_with_x_stars',
});
const getRatedStars = container => container
  .querySelector('.ui-shared__rating-stars')
  .getAttribute('data-test-id');

describe('<ReviewForm />', () => {
  beforeEach(() => {
    getCurrentRoute.mockReturnValue({
      pathname: '/some/path',
    });
  });

  it('should render form correctly', () => {
    const { container } = renderComponent(mockedStateWithoutReview);

    expect(container.querySelector('[data-test-id="reviewForm"] form')).toBeInTheDocument();
    expect(screen.getByText('reviews.review_form_rate')).toBeInTheDocument();
    expect(getRatingButtons()).toHaveLength(5);
    expect(getRatedStars(container)).toBe('ratedStars: 0');
    expect(screen.getAllByRole('textbox')).toHaveLength(3);
    expect(getAuthor()).toHaveValue('');
    expect(getTitle()).toHaveValue('');
    expect(getReview()).toHaveValue('');
    expect(screen.getByRole('button', { name: 'common.cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'common.submit' })).toHaveAttribute('type', 'submit');
  });

  it('should render empty', () => {
    const { container } = renderComponent(mockedStateWithoutProductData);

    expect(container.querySelector('[data-test-id="reviewForm"] form')).toBeInTheDocument();
    expect(getRatedStars(container)).toBe('ratedStars: 0');
    expect(getAuthor()).toHaveValue('');
    expect(getTitle()).toHaveValue('');
    expect(getReview()).toHaveValue('');
  });

  it('should render loading indicator', () => {
    const { container } = renderComponent(mockedStateWithUserReviewLoading);

    expect(container.querySelectorAll('[data-test-id="loadingIndicator"]')).toHaveLength(1);
    expect(container.querySelector('form')).not.toBeInTheDocument();
  });

  it('should validate form on submit', () => {
    const dispatchSpy = jest.fn();
    const { container } = renderComponent(mockedStateWithoutReview, dispatchSpy);

    fireEvent.submit(container.querySelector('form'));

    expect(getRatedStars(container)).toBe('ratedStars: 0');
    expect(screen.getByText('reviews.review_form_rate_error')).toBeInTheDocument();

    expect(getAuthor()).toHaveValue('');
    expect(getAuthor()).toBeInvalid();
    expect(getAuthor()).toHaveAccessibleDescription('reviews.review_form_error_author_empty');
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should set form data', () => {
    const { container } = renderComponent(mockedStateWithReview);
    const id = mockedStateWithReview.reviews.userReviewsByProductId.foo.review;
    const review = mockedStateWithReview.reviews.reviewsById[id];

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(getRatedStars(container)).toBe(`ratedStars: ${review.rate / 20}`);
    expect(getAuthor()).toHaveValue(review.author);
    expect(getTitle()).toHaveValue(review.title);
    expect(getReview()).toHaveValue(review.review);
  });

  it('should validate fields on change', () => {
    const { container } = renderComponent(mockedStateWithInvalidReview);

    expect(getReview()).toBeValid();

    fireEvent.submit(container.querySelector('form'));

    expect(getReview()).toBeInvalid();
    expect(getReview()).toHaveAccessibleDescription('reviews.review_form_error_length');

    fireEvent.change(getReview(), { target: { value: 'Lorem ipsum dolor sit amet' } });

    expect(getReview()).toHaveValue('Lorem ipsum dolor sit amet');
    expect(getReview()).toBeValid();
    expect(getReview()).not.toHaveAccessibleDescription();

    const longAuthor = new Array(256).fill('a').join('');
    fireEvent.change(getAuthor(), {
      target: {
        value: longAuthor,
      },
    });

    expect(getAuthor()).toBeInvalid();
    expect(getAuthor()).toHaveAccessibleDescription('reviews.review_form_error_length');

    fireEvent.change(getAuthor(), {
      target: {
        value: 'Author',
      },
    });

    expect(getAuthor()).toBeValid();
    expect(getAuthor()).not.toHaveAccessibleDescription();

    fireEvent.click(getRatingButtons()[0]);

    expect(getRatedStars(container)).toBe('ratedStars: 1');
  });

  it('should submit with valid review', () => {
    const dispatchSpy = jest.fn();
    const { container } = renderComponent(mockedStateWithReview, dispatchSpy);

    fireEvent.submit(container.querySelector('form'));

    expect(screen.queryByText('reviews.review_form_rate_error')).not.toBeInTheDocument();
    expect(getAuthor()).toBeValid();
    expect(getTitle()).toBeValid();
    expect(getReview()).toBeValid();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });
});
