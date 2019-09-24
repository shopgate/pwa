import React from 'react';
import { mount } from 'enzyme';
import Accordion from './index';

jest.unmock('@shopgate/pwa-ui-shared');

describe('<Accordion />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with renderLabel prop and children', () => {
    const wrapper = mount((
      <Accordion renderLabel={() => <div />}>
        Some content.
      </Accordion>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('AccordionContent').exists()).toBe(true);
  });

  it('should not render without a renderLabel prop', () => {
    const wrapper = mount(<Accordion />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should not render without children', () => {
    const wrapper = mount(<Accordion renderLabel={() => { }} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });
});
