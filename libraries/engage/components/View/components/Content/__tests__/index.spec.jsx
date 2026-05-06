import React from 'react';
import { shallow } from 'enzyme';
import Content from '../index';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  shopName: 'Test Shop',
  themeConfig: { colors: {} },
}));

jest.mock('@shopgate/pwa-common/context', () => {
  // eslint-disable-next-line global-require
  const { createContext } = require('react');
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
    const wrapper = shallow((
      <Content setContentRef={jest.fn()}>
        <div>Page #1</div>
      </Content>
    ), { disableLifecycleMethods: true })
      // Dive through Route context and into render component
      .dive().dive();

    expect(wrapper).toMatchSnapshot();
  });
});
