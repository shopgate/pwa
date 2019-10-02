import React from 'react';
import { shallow } from 'enzyme';
import AccordionContent from './index';

describe('<AccordionContent />', () => {
  it('should render as closed', () => {
    const wrapper = shallow((
      <AccordionContent id="some-id">
        <div id="test">Some Child</div>
      </AccordionContent>
    ));

    expect(wrapper.find('#test').text()).toEqual('Some Child');
    expect(wrapper.prop('style').height).toEqual(0);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as open', () => {
    const wrapper = shallow((
      <AccordionContent open id="some-id">
        <div id="test">Some Child</div>
      </AccordionContent>
    ));

    expect(wrapper.find('#test').text()).toEqual('Some Child');
    expect(wrapper.prop('style').height).toEqual('auto');
    expect(wrapper).toMatchSnapshot();
  });
});
