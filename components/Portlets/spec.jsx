import React from 'react';
import { shallow, mount } from 'enzyme';
import Portlets from './index';

/**
 * A test component.
 * @return {JSX}
 */
const TestComponent = () => (
  <div>My test component</div>
);

describe('Portlets', () => {
  it('should render without any props', () => {
    const wrapper = shallow(<Portlets />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render if array is not set.', () => {
    const wrapper = shallow(<Portlets />);
    expect(wrapper.children().get(0)).toEqual(null);
  });

  it('should not render if array is empty.', () => {
    const wrapper = shallow(<Portlets components={{}} />);
    expect(wrapper.children().get(0)).toEqual(null);
  });

  it('should not render invalid children', () => {
    const wrapper = shallow(<Portlets components={{ sometest: null }} />);
    expect(wrapper.children().get(0)).toEqual(null);
  });

  it('should return an array with the given test components.', () => {
    const componentObject = {
      myTestComponent: TestComponent,
    };
    const wrapper = mount(<Portlets components={componentObject} />);
    expect(wrapper.children.length).toEqual(1);
    expect(wrapper.children().get(0).type === TestComponent).toEqual(true);
  });
});
