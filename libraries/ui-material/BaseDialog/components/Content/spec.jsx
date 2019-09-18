import React from 'react';
import { shallow } from 'enzyme';
import Content from './index';

describe('<Content />', () => {
  it('should not render if no content is passed', () => {
    const wrapper = shallow(<Content />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render content components', () => {
    const wrapper = shallow(<Content content="Hello World" />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('[id="basicDialogDesc"]').length).toBe(1);
  });
});
