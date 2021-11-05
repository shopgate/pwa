import React from 'react';
import { shallow, mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import Header from './index';

describe('<Header />', () => {
  it('should render with correct title', () => {
    const title = 'My Title';
    const wrapper = shallow(<Header title={title} />, mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('GridItem').first().props().children).toEqual(title);
  });

  it('should render searchbar', () => {
    const title = 'My Title';
    const wrapper = mount(<Header title={title} showSearch />, mockRenderOptions);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SearchBar').length).toBe(1);
  });

  it('should call handleChange on input', () => {
    const title = 'My Title';
    const handleChange = jest.fn();
    const wrapper = mount(
      <Header
        title={title}
        showSearch
        handleChange={handleChange}
      />, mockRenderOptions
    );
    wrapper.find('input').first().simulate('change', { target: { name: 'search', value: 'asdf' } });
    expect(handleChange).toHaveBeenCalledWith('asdf');
  });
});
