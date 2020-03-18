// @flow
import { css } from 'glamor';
import { themeVariables, themeColors } from '@shopgate/pwa-common/helpers/config';

const { gap } = themeVariables;

export const items = css({
  background: themeColors.background,
  padding: `${gap.small * 1.5}px ${gap.small * 1.5}px ${gap.big}px`,
  fontSize: '0.875rem',
  boxShadow: 'inset rgba(0, 0, 0, .117647) 0 1px 6px, inset rgba(0, 0, 0, .117647) 0 1px 4px',
});

export const card = css({
  background: themeColors.light,
  marginBottom: gap.small * 1.5,
  ':last-of-type': {
    marginBottom: 0,
  },
  border: `1px solid ${themeColors.shade7}`,
  boxSizing: 'border-box',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
  borderRadius: '0px 0px 3px 3px',
}).toString();
