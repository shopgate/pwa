import React from 'react';
import { Conditioner } from '@shopgate/engage/core';

export const defaultContext = {
  productId: null,
  variantId: null,
  options: {},
  characteristics: {},
  setCharacteristic: jest.fn(),
  conditioner: new Conditioner(),
};

let context;

export const ProductContext = ({
  Provider(props) {
    /* eslint-disable react/prop-types */
    context = props.value || defaultContext;
    return React.createElement('div', null, props.children);
    /* eslint-enable react/prop-types */
  },
  Consumer(props) {
    return props.children(context || defaultContext);
  },
});
