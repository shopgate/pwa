import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const info = css({
  marginTop: variables.gap.xsmall,
  padding: `0 ${variables.gap.big}px`,
}).toString();

const required = css({
  color: 'var(--color-text-medium-emphasis)',
  fontSize: '0.825rem',
}).toString();

const price = css({
  textAlign: 'right',
  fontSize: '0.825rem',
}).toString();

export default {
  info,
  required,
  price,
};
