import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { mockedState } from './mock';

const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);
jest.mock('./components/ReviewForm', () => () => '');
const mockedStore = configureStore();
/**
 * Creates component
 * @return {ReactWrapper}
 */
const createComponent = () => {
  /* eslint-disable global-require */
  const { UnwrappedWriteReview } = require('./index');
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore(mockedState)}>
      <UnwrappedWriteReview productId="foo" />
    </Provider>,
    mockRenderOptions
  );
};

describe('<WriteReview> page', () => {
  it('should not crash', () => {
    const component = createComponent();
    expect(component.find('WriteReview').exists()).toBe(true);
  });
});
