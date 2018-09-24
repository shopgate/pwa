import React from 'react';
import { shallow, mount } from 'enzyme';
import { Unwrapped as ApplyFilterButton } from './index';

describe('<ApplyFilterButton />', () => {
  it('it should render', () => {
    const wrapper = shallow(<ApplyFilterButton
      applyFilters={() => {}}
      goBackHistory={() => {}}
    />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger the applyFilters function', () => {
    const applyFiltersSpy = jest.fn();

    const wrapper = shallow(<ApplyFilterButton
      applyFilters={applyFiltersSpy}
    />);

    wrapper.simulate('click', { preventDefault: () => {} });
    expect(applyFiltersSpy).toHaveBeenCalled();
  });

  it('should not trigger the applyFilters function when there are no filter changes', () => {
    const applyFiltersSpy = jest.fn();

    const wrapper = mount(<ApplyFilterButton
      applyFilters={applyFiltersSpy}
      filtersChanged={false}
    />);

    wrapper.simulate('click', { preventDefault: () => {} });
    expect(applyFiltersSpy).not.toHaveBeenCalled();
  });
});
