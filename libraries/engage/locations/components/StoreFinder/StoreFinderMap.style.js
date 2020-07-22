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
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
  //  position: 'fixed',
    zIndex: 10,
    maxHeight: 200,
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

const pulseAnimation = css.keyframes({
  '0%': { boxShadow: '0 0 0 0px rgba(0, 0, 0, 0.2)' },
  '100%': { boxShadow: '0 0 0 10px rgba(0, 0, 0, 0)' },
});

export const userPosition = css({
  ' div': {
    background: 'var(--color-secondary)',
    border: '2px solid #fff',
    borderRadius: 25,
    height: 20,
    width: 20,
    animation: `${pulseAnimation} 2s infinite`,
  },
}).toString();

