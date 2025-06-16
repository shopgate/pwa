import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
}).toString();

export const selected = css({
}).toString();

export const directionsButton = css({
  padding: `0 ${variables.gap.big}px ${variables.gap.big}px`,
}).toString();
