/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Image from '@shopgate/pwa-common/components/Image';
import Placeholder from 'Components/icons/PlaceholderIcon';
import ProductImage from './index';

describe('<ProductImage />', () => {
  it('should render a placeholder if no src prop is provided', () => {
    const wrapper = shallow(
      <ProductImage />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Image).length).toBe(0);
    expect(wrapper.find(Placeholder).length).toBe(1);
  });

  it('should render the image without a placeholder', () => {
    const wrapper = shallow(
      <ProductImage src="http://placehold.it/300x300" />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Image).length).toBe(1);
    expect(wrapper.find(Placeholder).length).toBe(0);
  });
});
