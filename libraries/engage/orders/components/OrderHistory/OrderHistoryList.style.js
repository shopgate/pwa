import { css } from 'glamor';
import { themeConfig, themeColors, themeName } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const isIOS = themeName.includes('ios');

export const orderNumber = css({
  fontWeight: 500,
});

export const list = css({
  background: `var(--color-background-accent, ${themeColors.background})`,
  marginBottom: `-${variables.gap.small * 1.5}px`,
});

export const cardContent = css({
  padding: variables.gap.big,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
}).toString();

export const column = css({
  display: 'flex',
  flexDirection: 'column',
});

export const rightAlign = css({
  textAlign: 'right',
});

export const card = css({
  marginBottom: variables.gap.small * 1.5,
  ':last-of-type': {
    marginBottom: 0,
  },
  background: themeColors.light,
  boxSizing: 'border-box',
  boxShadow: themeConfig.shadows.productCard,
  borderRadius: isIOS ? 10 : 2,
}).toString();
