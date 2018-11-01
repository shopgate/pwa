import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { makeGetMenuById } from './selectors';
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
jest.mock('./selectors', () => ({
  makeGetMenuById: () => () => mockedQuicklinks,
}));

const mockContext = {
  context: {
    i18n: () => ({ __: text => text }),
  },
  childContextTypes: {
    i18n: PropTypes.func.isRequired,
  },
};

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
    const quicklinks = makeGetMenuById()();
    const wrapper = mount((
      <Provider store={store}>
        <Quicklinks />
      </Provider>), mockContext);

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
      </Provider>), mockContext);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Quicklinks').isEmptyRender()).toBe(true);
  });
});
