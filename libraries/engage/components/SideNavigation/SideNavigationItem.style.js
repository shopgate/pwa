import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

/**
 * @param {number} level The indentation level
 * @returns {string}
 */
export const getIndentation = (level = 0) => css({
  paddingLeft: (level * variables.gap.big),
}).toString();

export const list = css({
  position: 'relative',
}).toString();

export const item = css({
  alignItems: 'center',
  display: 'flex',
  textAlign: 'left',
  outline: 0,
  padding: variables.gap.big,
  position: 'relative',
  width: '100%',
  lineHeight: '1.45em',
}).toString();

export const itemActive = css({
  background: 'var(--color-side-navigation-active-background)',
}).toString();

export const link = css({
  flexGrow: 1,
  textAlign: 'left',
  outline: 0,
  color: 'var(--color-text-high-emphasis)',
  ':hover': {
    color: 'var(--color-primary)',
  },
}).toString();

export const linkActive = css({
  color: 'var(--color-primary) !important',
}).toString();

