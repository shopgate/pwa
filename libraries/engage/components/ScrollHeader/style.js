import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export const root = css({
  position: 'sticky',
  left: 0,
  backgroundColor: '#fff',
  [responsiveMediaQuery('<=xs', { appAlways: true })]: {
    boxShadow: 'rgba(0, 0, 0, 0.118) 0px 1px 6px, rgba(0, 0, 0, 0.118) 0px 1px 4px',
  },
});

export const scrolledIn = css({
  '&&': {
    transform: 'translateY(0%)',
  },
});

export const scrolledOut = css({
  '&&': {
    transform: 'translateY(-250%)',
  },
});

export const transition = css({
  transition: 'transform 0.2s ease,transform 0.2s',
});
