/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import { shallow } from 'enzyme';
import Price from './index';

describe('Favorites price component', () => {
  describe('shouldComponentUpdate', () => {
    const props = {
      price: {
        unitPriceStriked: 0,
        currency: 'EUR',
        unitPriceWithTax: 1,
      },
    };
    it('should return false when price is the same', () => {
      const component = shallow(<Price price={props.price} />);
      expect(component.instance().shouldComponentUpdate(props)).toBe(false);
    });
    it('should return true when price is not the same', () => {
      const component = shallow(<Price price={props.price} />);
      const newProps = {
        price: {
          ...props.price,
          unitPriceWithTax: 0,
        },
      };
      expect(component.instance().shouldComponentUpdate(newProps)).toBe(true);
    });
  });
});
