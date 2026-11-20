import React from 'react';
import { renderToString } from 'react-dom/server';
import ShippingMethodIcon from './ShippingMethodIcon';

describe('<ShippingMethodIcon />', () => {
  it('shows the shipping icon', () => {
    expect(renderToString(<ShippingMethodIcon />)).toContain('M20 8h-3V4H3');
  });
});
