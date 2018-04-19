import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import {
  mockedState,
  mockedEmpty,
} from './mock';

const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);
const mockedStore = configureStore();

/**
 * Creates component
 * @return {ReactWrapper}
 * @param {Object} state Component state
 */
const createComponent = (state) => {
  /* eslint-disable global-require */
  const Filter = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore(state)}>
      <Filter />
    </Provider>,
    mockRenderOptions
  );
};

beforeEach(() => {
  jest.resetModules();
});

describe('<Filter> page', () => {

  it('should render', () => {
    const component = createComponent(mockedState);
    expect(component.find('Filter').exists()).toBe(true);
    expect(component.find('CardList').children().length).toBeTruthy();
    expect(component).toMatchSnapshot();
  });

  it('should render empty', () => {
    const component = createComponent(mockedEmpty);
    expect(component.find('Filter').children().length).toBe(0);
  });
});
