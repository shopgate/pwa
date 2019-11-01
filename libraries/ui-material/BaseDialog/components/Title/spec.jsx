import React from 'react';
import { shallow } from 'enzyme';
import Title from './index';

describe('<Title />', () => {
  it('should not render without a title', () => {
    const wrapper = shallow(<Title />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render with a title', () => {
    const wrapper = shallow(<Title title="Some test title" />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('[id="basicDialogTitle"]').length).toBe(1);
  });
});
