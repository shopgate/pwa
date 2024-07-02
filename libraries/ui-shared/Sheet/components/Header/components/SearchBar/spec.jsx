import React from 'react';
import { mount } from 'enzyme';
import SearchBar from './index';

describe('<SearchBar />', () => {
  it('should call handleChange on input', async () => {
    const handleChange = jest.fn();
    const wrapper = await mount(
      <SearchBar handleChange={handleChange} />
    );

    expect(wrapper).toMatchSnapshot();
    // Update input
    wrapper.find('input').first().simulate('change', { target: { name: 'search', value: 'asdf' } });
    // Should call with updated state.
    expect(handleChange).toHaveBeenCalledWith('asdf');
  });
});
