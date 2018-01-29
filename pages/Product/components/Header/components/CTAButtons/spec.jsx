/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { shallow } from 'enzyme';
import FavoritesButton from 'Components/FavoritesButton';
import CTAButtons from './index';
import AddToCartButton from './components/AddToCartButton';

describe('CTAs (product header)', () => {
  describe('Rendering', () => {
    it('should render rating when data is available', () => {
      const component = shallow(<CTAButtons />);
      expect(component).toMatchSnapshot();
      expect(component.find(FavoritesButton).exists()).toBe(true);
      expect(component.find(AddToCartButton).exists()).toBe(true);
    });
  });
});

