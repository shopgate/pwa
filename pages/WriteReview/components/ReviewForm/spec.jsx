import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import {
  mockedStateWithoutReview,
  mockedStateWithInvalidReview,
  mockedStateWithReview,
} from './mock';

const mockedStore = configureStore();

beforeEach(() => {
  jest.resetModules();
});

/**
 * Creates component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @return {ReactWrapper}
 */
const createComponent = (mockedState, dispatchSpy = jest.fn()) => {
  /* eslint-disable global-require */
  const ReviewForm = require('./index').default;
  const store = mockedStore(mockedState);
  store.dispatch = dispatchSpy;
  /* eslint-enable global-require */
  return mount(
    <Provider store={store}>
      <ReviewForm submit={() => {}} />
    </Provider>,
    {
      context: {
        i18n: () => ({
          __: (input) => {
            if (input) {
              return 'translation';
            }
            return '';
          },
        }),
      },
      childContextTypes: {
        i18n: PropTypes.func,
      },
    });
};

describe('<ReviewForm />', () => {
  it('should render form correctly', () => {
    const comp = createComponent(mockedStateWithoutReview);
    expect(comp.find('RatingScale').length).toEqual(1);

    const fields = comp.findWhere(c => c.length && c.name() === 'TextField');
    expect(fields.length).toEqual(3);
  });

  it('should validate form on submit', () => {
    const comp = createComponent(mockedStateWithoutReview);
    comp.find('form').simulate('submit');
    comp.update();

    const errors = comp.find('ReviewForm').instance().state.validationErrors;
    const author = comp.findWhere(c =>
      c.length && c.name() === 'TextField' && c.prop('name') === 'author'
    );

    expect(comp.find('RatingScale').prop('value')).toEqual(0);
    expect(comp.find('RatingScale').prop('errorText')).toBeDefined();
    expect(errors.rate).toBeDefined();

    expect(author.prop('value')).toBeFalsy();
    expect(author.prop('errorText')).toBeDefined();
    expect(errors.author).toBeDefined();
  });

  it('should set form data', () => {
    const comp = createComponent(mockedStateWithReview);
    const id = mockedStateWithReview.reviews.userReviewsByProductId.foo.review;
    const review = mockedStateWithReview.reviews.reviewsById[id];
    const form = comp.find('form');

    expect(form.exists()).toEqual(true);
    expect(form.find('RatingScale').prop('value')).toEqual(review.rate);
    expect(form.find('TextField').at(0).prop('value')).toEqual(review.author);
    expect(form.find('TextField').at(1).prop('value')).toEqual(review.title);
    expect(form.find('TextField').at(2).prop('value')).toEqual(review.review);
  });

  it('should validate fields on change', () => {
    const comp = createComponent(mockedStateWithInvalidReview);
    comp.find('form').simulate('submit');
    comp.update();

    // Check validation with to long review
    const errors1 = comp.find('ReviewForm').instance().state.validationErrors;
    const review = comp.findWhere(c =>
      c.length && c.name() === 'TextField' && c.prop('name') === 'review'
    );
    expect(errors1.review).toBeDefined();

    // Check validation with changed, shorter review
    review.find('textarea').simulate('change', { target: { value: 'Lorem ipsum dolor sit amet' } });
    comp.update();

    const errors2 = comp.find('ReviewForm').instance().state.validationErrors;
    expect(errors2.review).toBeFalsy();
  });

  it('should submit with valid review', () => {
    const comp = createComponent(mockedStateWithReview);
    comp.find('form').simulate('submit');
    comp.update();
    const errors = comp.find('ReviewForm').instance().state.validationErrors;
    expect(Object.keys(errors).length).toBe(0);
  });
});
