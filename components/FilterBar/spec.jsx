import React from 'react';
import { shallow } from 'enzyme';
import { GRID_VIEW } from '../../pages/Category/constants';
import FilterBar from './index';

describe('<FilterBar>', () => {
  global.requestAnimationFrame = () => {};

  it('should hide if outside of the view', () => {
    const wrapper = shallow(
      <FilterBar
        handleSortChange={() => {}}
        handleOpenFiltersView={() => {}}
        getFilters={() => {}}
      />
    );

    const filterBar = wrapper.instance();
    filterBar.element = {
      offsetHeight: 50,
    };

    filterBar.scrollElement = {
      scrollTop: 300,
    };

    expect(filterBar.isVisible).toBe(true);
    filterBar.animate();
    expect(filterBar.isVisible).toBe(false);
    filterBar.scrollElement.scrollTop = 0;
    filterBar.animate();
    expect(filterBar.isVisible).toBe(true);
  });

  it('does not reset the spacer height if element height is not available', () => {
    const wrapper = shallow(
      <FilterBar
        handleSortChange={() => {}}
        handleOpenFiltersView={() => {}}
        getFilters={() => {}}
      />
    );
    const filterBar = wrapper.instance();

    filterBar.element = { offsetHeight: 50 };
    filterBar.componentDidUpdate();
    expect(filterBar.state.spacerHeight).toEqual(50);

    filterBar.element = {};
    filterBar.componentDidUpdate();
    expect(filterBar.state.spacerHeight).toEqual(50);

    filterBar.element = { offsetHeight: 0 };
    filterBar.componentDidUpdate();
    expect(filterBar.state.spacerHeight).toEqual(50);

    filterBar.element = { offsetHeight: 30 };
    filterBar.componentDidUpdate();
    expect(filterBar.state.spacerHeight).toEqual(30);
  });
});
