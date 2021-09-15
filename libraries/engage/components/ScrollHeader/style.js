import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export const header = css({
  position: 'sticky',
  top: 0,
  left: 0,
  backgroundColor: '#fff',
  transform: 'translateY(0)',
  transition: 'transform 0.3s ease',
  [responsiveMediaQuery('<=xs', { appAlways: true })]: {
    boxShadow: 'rgba(0, 0, 0, 0.118) 0px 1px 6px, rgba(0, 0, 0, 0.118) 0px 1px 4px',
  },
}).toString();

export const hidden = css({
  transform: 'translateY(-250%)',
}).toString();

