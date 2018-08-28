import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;
const { gap } = variables;

export const container = css({
  padding: `${gap.big}px ${gap.xxbig}px ${gap.big}px ${gap.big}px`,
});

export const content = css({
  padding: `0 ${variables.gap.big}px ${variables.gap.big}px`,
});
