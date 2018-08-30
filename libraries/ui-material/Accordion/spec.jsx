import React from 'react';
import { shallow } from 'enzyme';
import Accordion from './index';

describe('<Accordion />', () => {
  it('should not render without a label', () => {
    const wrapper = shallow(<Accordion />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render without children', () => {
    const wrapper = shallow(<Accordion label="something" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render in closed state', () => {
    const wrapper = shallow((
      <Accordion label="something">
        Some content.
      </Accordion>
    ));

    expect(wrapper).toMatchSnapshot();
  });
});
