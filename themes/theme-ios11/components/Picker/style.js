import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const picker = css({
  outline: 0,
}).toString();

export const withButton = css({
  display: 'flex',
  marginBottom: variables.gap.small,
  minHeight: 60,
}).toString();

