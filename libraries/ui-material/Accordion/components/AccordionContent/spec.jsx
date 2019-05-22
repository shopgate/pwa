import React from 'react';
import { shallow } from 'enzyme';
import AccordionContent from './index';

describe('<AccordionContent />', () => {
  it('should render as closed', () => {
    const wrapper = shallow((
      <AccordionContent>
        <div id="test">Some Child</div>
      </AccordionContent>
    ));

    expect(wrapper.find('#test').text()).toEqual('Some Child');
    expect(wrapper.prop('style').height.value).toEqual(0);
  });

  it('should render as open', () => {
    const wrapper = shallow((
      <AccordionContent open>
        <div id="test">Some Child</div>
      </AccordionContent>
    ));

    expect(wrapper.find('#test').text()).toEqual('Some Child');
    expect(wrapper.prop('style').height.value).toEqual('auto');
  });
});
