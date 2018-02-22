/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import { mount, shallow } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { FILTER_TYPE_MULTISELECT } from '@shopgate/pwa-common-commerce/filter/constants';
import GridIcon from 'Components/icons/GridIcon';
import ListIcon from 'Components/icons/ListIcon';
import { GRID_VIEW, LIST_VIEW } from 'Pages/Category/constants';
import { UnwrappedContent as FilterBarContent } from './index';

const activeFilters = {
  Size: {
    label: 'Size',
    source: 'attributes',
    type: FILTER_TYPE_MULTISELECT,
    values: ['31'],
  },
};

describe.skip('<FilterBarContent />', () => {
  it('should execute handleToggleViewMode callback when left button is clicked', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <FilterBarContent
        handleToggleViewMode={spy}
        handleSortChange={() => {}}
        handleOpenFiltersView={() => {}}
        getFilters={() => {}}
        componentUpdated={() => {}}
      />,
      mockRenderOptions
    );

    const button = wrapper.find('button').first();
    const node = ReactDOM.findDOMNode(button.node); // eslint-disable-line react/no-find-dom-node
    TestUtils.Simulate.click(node);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should execute handleOpenFiltersView callback when right button is clicked', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <FilterBarContent
        handleToggleViewMode={() => {}}
        handleSortChange={() => {}}
        handleOpenFiltersView={spy}
        getFilters={() => {}}
        componentUpdated={() => {}}
      />,
      mockRenderOptions
    );

    const button = wrapper.find('button').last();
    const node = ReactDOM.findDOMNode(button.node); // eslint-disable-line react/no-find-dom-node
    TestUtils.Simulate.click(node);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render in grid view mode', () => {
    const wrapper = mount(
      <FilterBarContent
        viewMode={GRID_VIEW}
        handleToggleViewMode={() => {}}
        handleSortChange={() => {}}
        handleOpenFiltersView={() => {}}
        getFilters={() => {}}
        componentUpdated={() => {}}
      />,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(GridIcon).length).toEqual(0);
    expect(wrapper.find(ListIcon).length).toEqual(1);
  });

  it('should render in list view mode', () => {
    const wrapper = mount(
      <FilterBarContent
        viewMode={LIST_VIEW}
        handleToggleViewMode={() => {}}
        handleSortChange={() => {}}
        handleOpenFiltersView={() => {}}
        getFilters={() => {}}
        componentUpdated={() => {}}
      />,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(GridIcon).length).toEqual(1);
    expect(wrapper.find(ListIcon).length).toEqual(0);
  });

  describe('should call getFilters', () => {
    let getFiltersSpy = null;
    let filterBarWrapper = null;
    let filterBarInstance = null;

    beforeEach(() => {
      getFiltersSpy = jest.fn();
      filterBarWrapper = shallow(
        <FilterBarContent
          viewMode={GRID_VIEW}
          handleToggleViewMode={() => {}}
          handleSortChange={() => {}}
          getFilters={getFiltersSpy}
          componentUpdated={() => {}}
        />,
        mockRenderOptions
      );
      filterBarInstance = filterBarWrapper.instance();
    });

    it('should call getFilters at componentDidMount', () => {
      filterBarInstance.componentDidMount();

      expect(getFiltersSpy).toHaveBeenCalledTimes(1);
    });

    it('should call getFilters at props.activeFilter changes', () => {
      filterBarWrapper.setProps({ activeFilters });

      expect(getFiltersSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Given activeFilters are handled correctly', () => {
    let filterBarWrapper = null;

    beforeEach(() => {
      filterBarWrapper = mount(
        <FilterBarContent
          viewMode={GRID_VIEW}
          handleToggleViewMode={() => {}}
          handleSortChange={() => {}}
          getFilters={() => {}}
          activeFilters={activeFilters}
          componentUpdated={() => {}}
        />,
        mockRenderOptions
      );
    });

    it('should render active filters', () => {
      expect(filterBarWrapper).toMatchSnapshot();
    });

    it('should open active filters', () => {
      const spy = jest.fn();
      filterBarWrapper.setProps({ handleOpenFiltersView: spy });

      // Trigger a click on a active filter
      filterBarWrapper
        .find('Chip').at(0)
        .find('button').at(1)
        .simulate('click');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should remove active filter', () => {
      const removeFilterSpy = jest.fn();
      const commmitFilterSpy = jest.fn();

      filterBarWrapper.setProps({
        removeTemporaryFilter: removeFilterSpy,
        commitTemporaryFilters: commmitFilterSpy,
      });

      // Trigger a click on the "X"
      filterBarWrapper
        .find('Chip').at(0)
        .find('button').at(0)
        .simulate('click');

      expect(removeFilterSpy).toHaveBeenCalledWith(Object.keys(activeFilters)[0], 0);
      expect(commmitFilterSpy).toHaveBeenCalledTimes(1);
    });
  });
});
