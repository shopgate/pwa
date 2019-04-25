import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Html, { UnwrappedHtml } from './index';

const { variables } = themeConfig;
const mockedStore = configureStore();

/**
 * @param {Object} settings The widget settings
 * @returns {JSX}
 */
const createComponent = (settings) => {
  const store = mockedStore({});
  return mount((
    <Provider store={store}>
      <Html settings={settings} />
    </Provider>
  ));
};

const defaultSettings = {
  defaultPadding: false,
  // The value for html is the HTML-escaped equivalent of the following:
  // <h1>Hello World!</h1>
  html: '&lt;h1&gt;Hello World!&lt;/h1&gt;',
};

describe('<HtmlWidget />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the widget', () => {
    const wrapper = createComponent(defaultSettings);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(UnwrappedHtml).childAt(0).prop('style')).toEqual({});
  });

  it('should render the widget with a padding', () => {
    const settings = {
      ...defaultSettings,
      defaultPadding: true,
    };

    const wrapper = createComponent(settings);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(UnwrappedHtml).childAt(0).prop('style').padding).toBe(variables.gap.big);
  });
});
