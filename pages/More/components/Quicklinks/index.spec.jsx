import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { getMenuById } from '@shopgate/pwa-common/selectors/menu';
import Quicklinks from './index';

const store = createMockStore();

jest.mock('@shopgate/pwa-common/components/Link', () => {
  /* eslint-disable react/prop-types */
  /**
   * Mocked LinkComponent.
   * @param {Object} props Component props.
   * @return {JSX}
   */
  const Link = ({ children }) => (
    <div>
      {children}
    </div>
  );

  /* eslint-enable react/prop-types */
  return Link;
});

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
    const wrapper = mount((
      <Provider store={store}>
        <Quicklinks />
      </Provider>), mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Quicklinks').isEmptyRender()).toBe(false);
    expect(wrapper.find('Headline').text()).toBe('navigation.more_menu');

    const links = wrapper.find('Link');
    quicklinks.forEach((entry, index) => {
      const link = links.at(index);
      expect(link.text()).toBe(entry.label);
      expect(link.prop('href')).toBe(entry.url);
    });
  });

  it('should not render when no quicklinks are there', () => {
    mockedQuicklinks = [];
    const wrapper = mount((
      <Provider store={store}>
        <Quicklinks />
      </Provider>), mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Quicklinks').isEmptyRender()).toBe(true);
  });
});
