import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import Content from '../index';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  shopName: 'Test Shop',
  themeConfig: { colors: {} },
}));

jest.mock('@shopgate/pwa-common/context', () => {
  const { createContext } = jest.requireActual('react');
  return {
    RouteContext: createContext({
      visible: true,
      pattern: '/',
      is404: false,
      id: 'test-route',
      state: { scrollTop: 0 },
    }),
  };
});
jest.mock('@shopgate/pwa-common/selectors/history', () => ({
  getSortOrder: jest.fn(),
}));
jest.mock('@virtuous/conductor', () => ({
  router: {
    update: jest.fn(),
  },
}));
jest.mock('@shopgate/engage/components');

jest.mock('../components/ParallaxProvider', () => ({
  __esModule: true,
  default: function ParallaxProvider({ children }) {
    return children;
  },
}));

describe('engage > components > view > components > content', () => {
  beforeEach(jest.clearAllMocks);

  it('should render content', () => {
    const { container } = render((
      <Content setContentRef={jest.fn()}>
        <div>Page #1</div>
      </Content>
    ));

    expect(container.querySelector('article')).not.toBeNull();
    expect(screen.getByText('Page #1')).toBeTruthy();
  });
});
