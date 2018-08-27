import React from 'react';
import { shallow } from 'enzyme';
import Accordion from './index';

/**
 * @returns {JSX}
 */
const Child = () => <div />;

describe('<Accordion />', () => {
  it('should render children with props', () => {
    const wrapper = shallow((
      <Accordion>
        {props => <Child {...props} />}
      </Accordion>
    ));

    const props = wrapper.find('Child').props();

    expect(props.isOpen).toEqual(false);
    expect(typeof props.open).toEqual('function');
    expect(typeof props.close).toEqual('function');
  });

  it('should update children props when state changes', () => {
    const wrapper = shallow((
      <Accordion>
        {props => <Child {...props} />}
      </Accordion>
    ));

    wrapper.setState({ open: true });

    expect(wrapper.find('Child').props().isOpen).toEqual(true);
  });
});
