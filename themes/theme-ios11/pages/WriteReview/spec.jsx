import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
// eslint-disable-next-line import/named
import { mockedState } from './mock';

jest.mock('@shopgate/engage/components');
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

describe.skip('<WriteReview> page', () => {
  it('should not crash', () => {
    const component = createComponent();
    expect(component).toMatchSnapshot();
    expect(component.find('WriteReview').exists()).toBe(true);
  });
});
