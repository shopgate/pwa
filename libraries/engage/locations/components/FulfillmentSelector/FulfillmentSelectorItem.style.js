// @flow
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const radioContainer = css({
  display: 'flex',
  flexFlow: 'row nowrap',
  padding: `${variables.gap.xsmall}px 0`,
});

const icon = {
  width: 24,
  height: 24,
  flexShrink: 0,
  marginTop: '-1px',
  marginRight: variables.gap.small,
};

export const inactiveIcon = css(icon).toString();

export const inactiveIconDisabled = css(icon, {
  opacity: 0.5,
}).toString();

export const activeIcon = css(icon, {
  color: colors.primary,
}).toString();

export const activeIconDisabled = css(icon, {
  color: colors.primary,
  opacity: 0.5,
}).toString();

export const radio = css({
  display: 'none',
});

export const content = css({
  flexGrow: 1,
});

export const itemRow = css({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignContent: 'stretch',
  alignItems: 'baseline',
});

export const itemColumn = css({
  flexGrow: 1,
  flexShrink: 0,
  width: '50%',
  '&:first-of-type': {
    paddingRight: variables.gap.small,
  },
  '&:last-of-type': {
    textAlign: 'right',
  },
});
