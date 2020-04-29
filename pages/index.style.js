import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { DESKTOP_MENU_BAR_WIDTH } from '../constants';

const { colors } = themeConfig;

export const navigation = css({
  flexShrink: 0,
  display: 'none',
  zIndex: 1,
  width: `${DESKTOP_MENU_BAR_WIDTH}px`,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    borderRight: `1px solid ${colors.shade7}`,
    display: 'block',
    backgroundColor: 'var(--page-background-color)',
  },
});

export const content = css({
  zIndex: 1,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    position: 'relative',
    backgroundColor: 'var(--page-background-color)',
    width: 'var(--page-content-width)',
  },
});
