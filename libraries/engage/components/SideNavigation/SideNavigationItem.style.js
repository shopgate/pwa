import { css } from 'glamor';
import Color from 'color';
import { getCSSCustomProp } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

/**
 * @param {number} level The indentation level
 * @returns {string}
 */
export const getIndentation = (level = 0) => css({
  paddingLeft: (level * variables.gap.big),
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
    color: `var(--color-primary, ${colors.primary})`,
  },
});

/**
 * @returns {string}
 */
export const getItemActive = () => css({
  background: Color(getCSSCustomProp('--color-primary') || colors.primary).fade(0.9),
  color: `var(--color-primary, ${colors.primary})`,
});

export const link = css({
  flexGrow: 1,
  textAlign: 'left',
  outline: 0,
}).toString();

