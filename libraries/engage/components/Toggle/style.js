import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const container = css({
  position: 'relative',
  marginBottom: -4,
}).toString();

export const label = css({
  display: 'block',
  height: 20,
  width: 44,
  background: '#898989',
  borderRadius: 100,
  cursor: 'pointer',
  bottom: -4,
  transition: 'all .3s ease',
}).toString();

export const checkbox = css({
  ':checked ~ label': {
    background: `var(--color-primary, ${colors.primary})`,
    opacity: 0.5,
  },
  ':checked ~ div': {
    left: 20,
    background: `var(--color-primary, ${colors.primary})`,
  },
  ':disabled ~ label': {
    background: '#D5D5D5',
    pointerEvents: 'none',
    filter: 'none',
  },
  ':disabled ~ div': {
    background: '#BCBDBC',
    filter: 'none',
  },
}).toString();

export const thumb = css({
  position: 'absolute',
  left: -2,
  top: -3,
  display: 'block',
  width: 26,
  height: 26,
  borderRadius: 100,
  background: 'white',
  boxShadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0,0,0,.12)',
  content: ' ',
  transition: 'all .3s ease',
  pointerEvents: 'none',
}).toString();

export const hidden = css({
  display: 'none',
}).toString();
