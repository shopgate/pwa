import React from 'react';
import { renderToString } from 'react-dom/server';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import StoreIcon from './StoreIcon';

describe('<StoreIcon />', () => {
  it('shows the shop front without an icon in the theme config', () => {
    themeConfig.icons.store = '';

    expect(renderToString(<StoreIcon />)).toContain('M20 4H4v2h16V4z');
  });

  it('shows the icon of the theme config', () => {
    themeConfig.icons.store = '<path d="custom"/>';

    expect(renderToString(<StoreIcon />)).toContain('d="custom"');
  });
});
