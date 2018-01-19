import React from 'react';
import { shallow } from 'enzyme';
import Portal from './index';

describe('Portal', () => {
  it('should render without any props', () => {
    const Component = <Portal />;
    const wrapper = shallow(Component);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render if no ID is set', () => {
    const Component = <Portal />;
    const wrapper = shallow(Component);
    expect(wrapper.children().get(0)).toEqual(null);
  });

  it('should not render if no children are supplied.', () => {
    const Component = <Portal id="someId" />;
    const wrapper = shallow(Component);
    expect(wrapper.children().get(0)).toEqual(null);
  });

  it('should not render if the target is not found', () => {
    const Component = (
      <Portal id="someId">
        <div>Some Child</div>
      </Portal>
    );
    const wrapper = shallow(Component);
    expect(wrapper.children().get(0)).toEqual(null);
  });
});
