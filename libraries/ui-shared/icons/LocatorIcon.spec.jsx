import React from 'react';
import { renderToString } from 'react-dom/server';
import LocatorIcon from './LocatorIcon';

const mockLegacyIcons = {};

jest.mock('@shopgate/engage/icons/helpers/themeIcons', () => ({
  ...jest.requireActual('@shopgate/engage/icons/helpers/themeIcons'),
  getLegacyThemeIcons: () => mockLegacyIcons,
}));

describe('<LocatorIcon />', () => {
  it('shows the crosshair without an icon in the theme config', () => {
    mockLegacyIcons.locator = '';

    expect(renderToString(<LocatorIcon />)).toContain('M12 8a4 4 0 100 8');
  });

  it('shows the icon of the theme config', () => {
    mockLegacyIcons.locator = '<path d="M1 1h22v22H1z"/>';

    expect(renderToString(<LocatorIcon />)).toContain('M1 1h22v22H1z');
  });
});
