import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const productContainer = css({
  padding: variables.gap.big,
  fontSize: '0.875rem',
  boxShadow: `inset 0 1px 0 ${colors.shade7}`,
}).toString();

export const productContainerInner = css({
  display: 'flex',
  flexFlow: 'row nowrap',
}).toString();

export const productImage = css({
  flex: '0 0 auto',
  width: '2.5rem',
  height: '2.5rem',
  background: colors.placeholder,
  marginRight: variables.gap.big,
}).toString();

export const productContent = css({
  flexGrow: 1,
  display: 'block',
}).toString();

export const productName = css({
  fontWeight: 600,
  marginBottom: variables.gap.small,
}).toString();

export const variants = css({
  color: colors.shade3,
  marginBottom: variables.gap.small,
}).toString();
