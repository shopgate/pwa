import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { defaultState } from '../../mock';
import NavigatorContent from './index';

jest.mock('./components/Search', () => {
  /**
   * Mock for the SearchComponent
   * @return {JSX}
   */
  const Search = () => <div />;
  return Search;
});

jest.mock('./components/Suggestions', () => {
  /**
   * Mock for the SuggestionsComponent
   * @return {JSX}
   */
  const Suggestions = () => <div />;
  return Suggestions;
});

const mockedStore = configureStore();

/**
 * Creates component with provided store state.
 * @param {Object} props Mocked props.
 * @return {ReactWrapper}
 */
const createComponent = (props) => {
  const store = mockedStore({
    ...defaultState,
    ui: {
      general: {
        title: 'test',
      },
    },
  });

  return mount((
    <Provider store={store}>
      <NavigatorContent {...props} />
    </Provider>
  ));
};

describe('<NavigatorContent />', () => {
  it('should render the logo', () => {
    const wrapper = createComponent({ routePattern: '/' });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Logo').exists()).toBe(true);
    expect(wrapper.find('Title').exists()).toBe(false);
    expect(wrapper.find('Search').exists()).toBe(true);
    expect(wrapper.find('Suggestions').exists()).toBe(true);
  });

  it('should render the title', () => {
    const wrapper = createComponent({ routePattern: 'some/other/path' });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Logo').exists()).toBe(false);
    expect(wrapper.find('Title').exists()).toBe(true);
    expect(wrapper.find('Search').exists()).toBe(true);
    expect(wrapper.find('Suggestions').exists()).toBe(true);
  });
});
