import React from 'react';
import { shallow } from 'enzyme';
import { mockThemeConfig } from '@shopgate/pwa-common/helpers/config/mock';
import { setPageBackgroundColor } from '../../../styles';
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
jest.mock('../../../styles', () => ({
  setPageBackgroundColor: jest.fn(),
}));

describe('engage > components > view > index', () => {
  beforeEach(jest.clearAllMocks);

  let wrapper;
  beforeAll(() => {
    wrapper = shallow((
      <View>
        <div>Page #1</div>
      </View>
    ));
  });

  it('should initialize with visible route', () => {
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should have structured content', () => {
    expect(wrapper.dive().dive().dive().dive()).toMatchSnapshot();
  });

  it('should set background on intialization', () => {
    wrapper = shallow((
      <View background="#990000">
        <div>Page #1</div>
      </View>
    )).dive().dive();

    expect(setPageBackgroundColor).toBeCalledWith('#990000');
  });
});
