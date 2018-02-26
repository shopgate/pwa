/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import ProductVariants from './index';
import * as mockData from './mock';

/**
 * Wrapped mock component
 * @return {JSX}
 * @constructor
 */
const Mock = () => <div />;

Mock.propTypes = {
  handleSelectionUpdate: PropTypes.func.isRequired,
  selection: PropTypes.arrayOf(PropTypes.shape()),
  variants: PropTypes.shape(),
};

Mock.defaultProps = {
  selection: null,
  variants: null,
};

const WrappedMock = ProductVariants(Mock);
const store = createMockStore();

describe('<ProductVariants />', () => {
  it('shouldn\'t render without variants', () => {
    const wrapper = mount(<WrappedMock store={store} />);
    wrapper.setProps({ variants: null });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Mock).prop('selection')).toEqual(null);
    expect(wrapper.find(Mock).prop('variants')).toEqual(null);
  });

  it('should render with variants', () => {
    const wrapper = mount(<WrappedMock store={store} />);
    wrapper.setProps({ variants: mockData.variants });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Mock).prop('selection')).toEqual(mockData.initialSelection);
  });

  it('should update after selectionUpdate', () => {
    const wrapper = mount(<WrappedMock store={store} />);
    wrapper.setProps({ variants: mockData.variants });

    wrapper.find(Mock).prop('handleSelectionUpdate')('1', '1');
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Mock).prop('selection')).toEqual(mockData.selectionUpdate);
  });
});
