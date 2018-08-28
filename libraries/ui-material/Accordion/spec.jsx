import React from 'react';
import { shallow, mount } from 'enzyme';
import Accordion from './index';

describe('<Accordion />', () => {
  it('should not render without a label', () => {
    const wrapper = shallow(<Accordion />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.get(0)).toBe(null);
  });

  it('should not render without children', () => {
    const wrapper = shallow(<Accordion label="something" />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.get(0)).toBe(null);
  });

  it('should render in closed state', () => {
    const wrapper = shallow((
      <Accordion label="something">
        Some content.
      </Accordion>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('AccordionContainer').children().length).toBe(1);
  });

  it('should open on click', () => {
    const wrapper = mount((
      <Accordion label="something">
        Some content.
      </Accordion>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('AccordionContainer').children().length).toBe(1);

    wrapper.find('div').simulate('click');
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('AccordionContainer').children().length).toBe(2);
  });
});
