import React from 'react';
import { renderToString } from 'react-dom/server';
import LocalShippingIcon from './LocalShippingIcon';

describe('<LocalShippingIcon />', () => {
  it('shows the shipping icon', () => {
    expect(renderToString(<LocalShippingIcon />)).toContain('M20 8h-3V4H3');
  });
});
