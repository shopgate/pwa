import React from 'react';
import { shallow } from 'enzyme';
import AccordionContainer from './index';

/**
 * @returns {JSX}
 */
const Child = () => <div />;

describe('<AccordionContainer />', () => {
  it('should render children with props', () => {
    const wrapper = shallow((
      <AccordionContainer>
        {props => <Child {...props} />}
      </AccordionContainer>
    ));

    const props = wrapper.find('Child').props();

    expect(wrapper).toMatchSnapshot();
    expect(props.open).toEqual(false);
    expect(typeof props.handleOpen).toEqual('function');
    expect(typeof props.handleClose).toEqual('function');
  });

  it('should update children props when state changes', () => {
    const wrapper = shallow((
      <AccordionContainer>
        {props => <Child {...props} />}
      </AccordionContainer>
    ));

    wrapper.setState({ open: true });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Child').props().open).toEqual(true);
  });
});
