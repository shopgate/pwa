import React from 'react';
import { renderToString } from 'react-dom/server';
import StoreIcon from './StoreIcon';

const mockLegacyIcons = {};

jest.mock('@shopgate/engage/icons/helpers/themeIcons', () => ({
  ...jest.requireActual('@shopgate/engage/icons/helpers/themeIcons'),
  getLegacyThemeIcons: () => mockLegacyIcons,
}));

describe('<StoreIcon />', () => {
  it('shows the shop front without an icon in the theme config', () => {
    mockLegacyIcons.store = '';

    expect(renderToString(<StoreIcon />)).toContain('M20 4H4v2h16V4z');
  });

  it('shows the icon of the theme config', () => {
    mockLegacyIcons.store = '<path d="M1 1h22v22H1z"/>';

    expect(renderToString(<StoreIcon />)).toContain('M1 1h22v22H1z');
  });
});
