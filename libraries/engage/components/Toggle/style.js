import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const root = css({
}).toString();

export const lbl = css({
  position: 'relative',
  display: 'block',
  height: 20,
  width: 44,
  background: '#898989',
  borderRadius: 100,
  cursor: 'pointer',
  transition: 'all .3s ease',
  ':after': {
    position: 'absolute',
    left: -2,
    top: -3,
    display: 'block',
    width: 26,
    height: 26,
    borderRadius: 100,
    background: 'white',
    boxShadow: '0px 3px 3px rgba(0,0,0,.05)',
    content: ' ',
    transition: 'all .3s ease',
  },
  ':active': {
    ':after': {
      transform: 'scale(1.15, .85)',
    },
  },
}).toString();

export const cbx = css({
  ':checked ~ label': {
    background: `var(--color-primary, ${colors.primary})`,
    filter: 'brightness(200%)',
    ':after': {
      left: 20,
      background: `var(--color-primary, ${colors.primary})`,
      filter: 'brightness(50%)',
    },
  },
  ':disabled ~ label': {
    background: '#D5D5D5',
    pointerEvents: 'none',
    ':after': {
      background: '#BCBDBC',
    },
  },
}).toString();

export const hidden = css({
  display: 'none',
}).toString();
