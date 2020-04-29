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
  ':hover': {
    color: 'var(--color-primary)',
  },
}).toString();

/**
 * @returns {string}
 */
export const getItemActive = () => css({
  background: 'var(--color-side-navigation-active-background)',
  color: 'var(--color-primary)',
});

export const link = css({
  flexGrow: 1,
  textAlign: 'left',
  outline: 0,
}).toString();

