import React from 'react';
import { shallow } from 'enzyme';

const sectionTitle = 'Section Title';

jest.mock('@shopgate/engage/components');

/**
 * Creates a component for testing.
 * @param {boolean} mockedValue Tells if the theme setting to show the section title is active.
 * @returns {Object}
 */
const createComponent = (mockedValue = true) => {
  jest.resetModules();
  jest.mock('@shopgate/pwa-common/helpers/config', () => {
    const originalConfig = jest.requireActual('@shopgate/pwa-common/helpers/config');
    return ({
      ...originalConfig,
      language: 'de-de',
      get showGmdMenuSubHeaders() { return mockedValue; },
    });
  });

  const NavDrawerSectionWrapper = jest.requireActual('./index').default;
  return shallow(<NavDrawerSectionWrapper title={sectionTitle} />);
};

describe('<NavDrawerSectionWrapper />', () => {
  it('should render with a title when the theme setting is active', () => {
    const wrapper = createComponent();
    expect(wrapper.find('NavDrawerSection').prop('title')).toBe(sectionTitle);
  });

  it('should render without a title when the theme setting is inactive', () => {
    const wrapper = createComponent(false);
    expect(wrapper.find('NavDrawerSection').prop('title')).toBe('');
  });
});
