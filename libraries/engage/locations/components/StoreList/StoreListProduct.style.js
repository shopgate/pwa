import { css } from 'glamor';
import { themeVariables, themeColors } from '@shopgate/pwa-common/helpers/config';

export const productContainer = css({
  padding: `${themeVariables.gap.bigger}px ${themeVariables.gap.bigger}px ${themeVariables.gap.small}px`,
  boxShadow: `inset 0 1px 0 ${themeColors.shade7}`,
}).toString();

export const productContainerInner = css({
  display: 'flex',
  flexFlow: 'row nowrap',
}).toString();

export const productImage = css({
  flex: '0 0 auto',
  width: '2.5rem',
  height: '2.5rem',
  background: themeColors.placeholder,
  marginRight: themeVariables.gap.bigger,
}).toString();

export const productContent = css({
  flexGrow: 1,
  display: 'block',
}).toString();

export const productName = css({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: themeVariables.gap.small,
}).toString();

export const productInfo = css({
  alignItems: 'flex-end',
}).toString();

export const productInfoLeft = css({
  fontSize: '0.875rem',
  color: themeColors.shade3,
}).toString();

export const priceInfo = css({
  color: `var(--color-primary, ${themeColors.primary})`,
  flexGrow: 0,
  textAlign: 'right',
  wordBreak: 'break-word',
  ' > ul ': {
    flexDirection: 'column-reverse',
  },
}).toString();
