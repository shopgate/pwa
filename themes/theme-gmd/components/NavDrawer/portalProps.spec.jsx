import React from 'react';
import { shallow } from 'enzyme';
import portalProps from './portalProps';

const { Headline } = portalProps;

describe('NavDrawer HeadlineCompatibility', () => {
  const headlineText = 'Headline Text';

  it('should render the headline when the text is passed via the title prop', () => {
    const wrapper = shallow(<Headline title={headlineText} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('NavDrawerTitle').prop('text')).toBe(headlineText);
  });

  it('should render the headline when the text is passed via the text prop', () => {
    const wrapper = shallow(<Headline text={headlineText} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('NavDrawerTitle').prop('text')).toBe(headlineText);
  });
});
