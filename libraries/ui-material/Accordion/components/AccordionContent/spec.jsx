import React from 'react';
import { mount } from 'enzyme';
import AccordionContent from './index';

jest.mock('react-spring', () => ({
  ...jest.requireActual('react-spring'),
  useSpring: jest.fn().mockReturnValue({ hook: 'useSpring return value' }),
}));

describe('<AccordionContent />', () => {
  it('should render as closed', () => {
    const wrapper = mount((
      <AccordionContent id="some-id">
        <div id="test">Some Child</div>
      </AccordionContent>
    ));

    expect(wrapper.find('#test').text()).toEqual('Some Child');
    expect(wrapper.find('div').get(0).props['aria-hidden']).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as open', () => {
    const wrapper = mount((
      <AccordionContent open id="some-id">
        <div id="test">Some Child</div>
      </AccordionContent>
    ));

    expect(wrapper.find('#test').text()).toEqual('Some Child');
    expect(wrapper.find('div').get(0).props['aria-hidden']).toEqual(false);
    expect(wrapper).toMatchSnapshot();
  });
});
