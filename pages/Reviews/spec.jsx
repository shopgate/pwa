import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { mockedState } from './mock';

const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);
jest.mock('./connector', () => Component => Component);
const mockedStore = configureStore();
/**
 * Creates component
 * @return {ReactWrapper}
 */
const createComponent = () => {
  /* eslint-disable global-require */
  const Reviews = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore(mockedState)}>
      <Reviews params={{ productId: '666f6f' }} fetchReviews={() => {}} />
    </Provider>,
    mockRenderOptions
  );
};

describe('<Reviews> page', () => {
  it('should not crash', () => {
    const component = createComponent();
    expect(component.find('Reviews').exists()).toBe(true);
  });
});
