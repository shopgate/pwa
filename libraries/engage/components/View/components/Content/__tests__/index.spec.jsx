import React from 'react';
import { shallow } from 'enzyme';
import Content from '../index';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  shopName: 'Test Shop',
  themeConfig: { colors: {} },
}));
jest.mock('@shopgate/pwa-common/context', () => ({
  RouteContext: {
    Consumer: jest.fn(({ children }) => children({
      visible: true,
    })),
  },
}));
jest.mock('@shopgate/pwa-common/selectors/history', () => ({
  getSortOrder: jest.fn(),
}));
jest.mock('../connector', () => ({
  __esModule: true,
  default: function Connector(Component) {
    return props => <Component {...props} />;
  },
}));
jest.mock('@shopgate/engage/components');

describe('engage > components > view > components > content', () => {
  beforeEach(jest.clearAllMocks);

  it('should render content', () => {
    const wrapper = shallow((
      <Content setContentRef={jest.fn()}>
        <div>Page #1</div>
      </Content>
    ), { disableLifecycleMethods: true })
      // Dive through Route context and into render component
      .dive().dive().dive();

    expect(wrapper).toMatchSnapshot();
  });
});
