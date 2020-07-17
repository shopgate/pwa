// @flow
import { css } from 'glamor';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

const { gap } = themeVariables;

export const root = css({
  padding: gap.big,
  borderTop: `1px solid ${themeColors.shade7}`,
  display: 'flex',
  justifyContent: 'center',
}).toString();

export const checkbox = css({
  marginLeft: 8,
}).toString();

export const text = css({
  flexGrow: 0,
}).toString();

export const space = css({
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
}).toString();

