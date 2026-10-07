import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import Html from './index';

const mockedStore = configureStore();

/**
 * @param {Object} settings The widget settings
 * @returns {Object}
 */
const renderComponent = (settings) => {
  const store = mockedStore({});
  return render((
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
  it('should render the widget', () => {
    const { container } = renderComponent(defaultSettings);
    const outer = container.firstChild;

    expect(screen.getByRole('heading', {
      level: 1,
      name: 'Hello World!',
    })).toBeInTheDocument();
    expect(outer).not.toHaveAttribute('style');
  });

  it('should render the widget with a padding', () => {
    const settings = {
      ...defaultSettings,
      defaultPadding: true,
    };

    const { container } = renderComponent(settings);
    const outer = container.firstChild;

    expect(screen.getByRole('heading', {
      level: 1,
      name: 'Hello World!',
    })).toBeInTheDocument();
    expect(outer).toHaveStyle({ padding: '16px' });
  });
});
