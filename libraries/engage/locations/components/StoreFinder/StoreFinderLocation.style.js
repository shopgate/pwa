import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { colors, variables } = themeConfig;

export const container = css({

}).toString();

export const selected = css({
  boxShadow: `0 0 0 2px var(--color-primary, ${colors.primary})`,
  borderRadius: 3,
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
    boxShadow: 'none',
  },
}).toString();

export const directionsButton = css({
  padding: `0 ${variables.gap.big}px ${variables.gap.big}px`,
}).toString();
