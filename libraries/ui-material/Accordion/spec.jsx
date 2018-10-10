import React from 'react';
import { mount } from 'enzyme';
import Accordion from './index';

jest.unmock('@shopgate/pwa-ui-shared');

console.error = jest.fn();

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
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('should not render without a renderLabel prop', () => {
    const wrapper = mount(<Accordion />);
    expect(wrapper).toMatchSnapshot();
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it('should not render without children', () => {
    const wrapper = mount(<Accordion renderLabel={() => {}} />);
    expect(wrapper).toMatchSnapshot();
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
