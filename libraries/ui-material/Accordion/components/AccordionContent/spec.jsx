import React from 'react';
import { shallow } from 'enzyme';
import AccordionContent from './index';

describe('<AccordionContent />', () => {
  it('should render as closed', () => {
    const wrapper = shallow((
      <AccordionContent>
        <div>Some Child</div>
      </AccordionContent>
    ));

    expect(wrapper).toMatchSnapshot();
  });

  it('should render as open', () => {
    const wrapper = shallow((
      <AccordionContent open>
        <div>Some Child</div>
      </AccordionContent>
    ));

    expect(wrapper).toMatchSnapshot();
  });
});
