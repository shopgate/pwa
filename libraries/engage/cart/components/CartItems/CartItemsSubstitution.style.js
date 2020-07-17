// @flow
import { css } from 'glamor';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

const { gap } = themeVariables;

export const root = css({
  padding: gap.big,
  borderBottom: `1px solid ${themeColors.shade7}`,
  display: 'flex',
  justifyContent: 'center',
}).toString();

export const checkbox = css({
  width: 'auto',
  paddingBottom: 0,
}).toString();

