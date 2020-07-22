import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

export const container = css({
  height: '100%',
  width: '100%',
  [responsiveMediaQuery('>sm', { appAlways: true })]: {
    borderRadius: 3,
    overflow: 'hidden',
  },
});

export const marker = css({
  ' svg': {
    height: 40,
    width: 40,
    fontSize: '1.5rem',
    color: `var(--color-text-medium-emphasis, ${themeColors.shade9})`,
  },
}).toString();

export const markerSelected = css({
  ' svg': {
    height: 40,
    width: 40,
    fontSize: '1.5rem',
    color: `var(--color-primary, ${themeColors.primary})`,
  },
}).toString();
