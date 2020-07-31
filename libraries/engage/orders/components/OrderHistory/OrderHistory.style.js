import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const root = css({
  padding: variables.gap.big,
}).toString();

export const title = css({
  fontSize: '1.5rem',
  padding: `${variables.gap.big}px 0`,
}).toString();
