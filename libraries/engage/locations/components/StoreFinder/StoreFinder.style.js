import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 1fr',
  gridTemplateAreas: '"search" "store-list"',
  height: 'inherit',
});

export const storeSearch = css({
  gridArea: 'search',
  padding: `${variables.gap.big}px 4px 0 4px`,
  ' select': {
    color: 'var(--color-text-medium-emphasis)',
  },
});

export const storeList = css({
  gridArea: 'store-list',
  width: '100%',
  overflow: 'hidden',
  padding: '0 12px 8px 12px',
});
