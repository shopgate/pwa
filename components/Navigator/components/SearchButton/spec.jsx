/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import SearchButton from './index';

describe('<SearchButton />', () => {
  it('should render without any further props', () => {
    const wrapper = shallow(
      <SearchButton />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger the onClick callback', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(
      <SearchButton onClick={onClickMock} />
    );
    const buttonTag = wrapper.find('button');
    buttonTag.simulate('click', { preventDefault: () => {} });
    expect(onClickMock).toBeCalled();
  });
});
