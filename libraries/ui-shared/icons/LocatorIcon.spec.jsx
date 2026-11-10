import React from 'react';
import { renderToString } from 'react-dom/server';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import LocatorIcon from './LocatorIcon';

describe('<LocatorIcon />', () => {
  it('shows the crosshair without an icon in the theme config', () => {
    themeConfig.icons.locator = '';

    expect(renderToString(<LocatorIcon />)).toContain('M12 8a4 4 0 100 8');
  });

  it('shows the icon of the theme config', () => {
    themeConfig.icons.locator = '<path d="custom"/>';

    expect(renderToString(<LocatorIcon />)).toContain('d="custom"');
  });
});
