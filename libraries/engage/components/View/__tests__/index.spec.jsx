import React from 'react';
import { render } from '@testing-library/react';
import { mockThemeConfig } from '@shopgate/pwa-common/helpers/config/mock';
import { setPageBackgroundColor } from '../../../styles/helpers';
import View from '../index';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  themeConfig: mockThemeConfig,
}));
jest.mock('@shopgate/pwa-common/context', () => ({
  RouteContext: {
    Consumer: jest.fn(({ children }) => children({ visible: true })),
  },
}));

jest.mock('../provider', () => ({ children }) => children);
jest.mock('../context');
// eslint-disable-next-line react/prop-types
jest.mock('../components/Content', () => ({ children }) => <div data-testid="view-content">{children}</div>);
jest.mock('../../../styles/helpers', () => ({
  setPageBackgroundColor: jest.fn(),
  responsiveMediaQuery: jest.fn(),
}));
jest.mock('@shopgate/engage/components');

describe('engage > components > view > index', () => {
  beforeEach(jest.clearAllMocks);

  it('should initialize with visible route', () => {
    const { container } = render((
      <View>
        <div>Page #1</div>
      </View>
    ));

    expect(container.querySelector('section')).toMatchSnapshot();
  });

  it('should have structured content', () => {
    const { container } = render((
      <View>
        <div>Page #1</div>
      </View>
    ));

    expect(container.querySelector('section')).toMatchSnapshot();
  });

  it('should set background on intialization', () => {
    render((
      <View background="#990000">
        <div>Page #1</div>
      </View>
    ));

    expect(setPageBackgroundColor).toBeCalledWith('#990000');
  });
});
