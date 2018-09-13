/* eslint-disable no-console */

import React from 'react';
import { mount } from 'enzyme';
import Accordion from './index';

console.error = jest.fn();

describe('<Accordion />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it('should render with renderLabel prop and children', () => {
    const wrapper = mount((
      <Accordion renderLabel={() => {}}>
        Some content.
      </Accordion>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('AccordionContent').exists()).toBe(true);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});

/* eslint-enable no-console */
