import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '../../../../components/ResponsiveContainer/mediaQuery';

export const container = css({
  height: '100%',
  width: '100%',
  [responsiveMediaQuery('>sm', { appAlways: true })]: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
  //  position: 'fixed',
    zIndex: 10,
  },
});

export const markerSelected = css({
  ' svg': {
    height: 40,
    width: 40,
    fontSize: '1.5rem',
    color: `var(--color-primary, ${themeColors.primary})`,
  },
}).toString();
