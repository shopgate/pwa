/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { getMenuById } from '@shopgate/pwa-common/selectors/menu';
import Quicklinks from './index';

const store = createMockStore();

jest.mock('@shopgate/engage/back-in-stock/selectors', () => ({
  getIsBackInStockEnabled: jest.fn(() => false),
}));
jest.mock('@shopgate/engage/components', () => ({
  I18n: { Text: ({ string }) => string },
  Link: ({ children, href, role }) => <a href={href} role={role}>{children}</a>,
  SurroundPortals: ({ children }) => children,
  Typography: ({ children, component: Component }) => <Component>{children}</Component>,
}));

let mockedQuicklinks;
jest.mock('@shopgate/pwa-common/selectors/menu', () => ({
  getMenuById: () => mockedQuicklinks,
}));

describe('<Quicklinks />', () => {
  beforeEach(() => {
    mockedQuicklinks = [
      /* eslint-disable extra-rules/no-single-line-objects */
      { url: '/some/url', label: 'Some Label' },
      { url: '/another/url', label: 'Another Label' },
      /* eslint-enable extra-rules/no-single-line-objects */
    ];
  });

  it('should render quicklinks', () => {
    const quicklinks = getMenuById();
    render((
      <Provider store={store}>
        <Quicklinks />
      </Provider>));

    expect(screen.getByRole('heading', {
      level: 2,
      name: 'navigation.more_menu',
    })).toBeInTheDocument();

    const links = screen.getAllByRole('button');

    expect(links).toHaveLength(quicklinks.length);
    quicklinks.forEach((entry, index) => {
      expect(links[index]).toHaveTextContent(entry.label);
      expect(links[index]).toHaveAttribute('href', entry.url);
    });
  });

  it('should not render when no quicklinks are there', () => {
    mockedQuicklinks = [];
    const { container } = render((
      <Provider store={store}>
        <Quicklinks />
      </Provider>));

    expect(container).toBeEmptyDOMElement();
  });
});
/* eslint-enable react/prop-types */
