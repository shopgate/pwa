// @flow
import { css } from 'glamor';
import { themeVariables, themeColors } from '@shopgate/pwa-common/helpers/config';

export const container = css({
  fontSize: '0.75rem',
  paddingTop: themeVariables.gap.xsmall * 0.5,
});

export const unavailable = css({
  color: themeColors.dark,
  fontSize: '0.625rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  opacity: 0.5,
});
