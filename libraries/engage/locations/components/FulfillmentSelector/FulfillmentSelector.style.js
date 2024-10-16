import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const container = css({
  padding: `${variables.gap.small}px ${variables.gap.big}px`,
});
