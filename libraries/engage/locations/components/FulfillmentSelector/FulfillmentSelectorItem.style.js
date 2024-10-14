import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const radioContainer = css({
  display: 'flex',
  flexFlow: 'row nowrap',
  padding: `${variables.gap.xsmall}px 0`,
});

export const disabled = css({
  cursor: 'not-allowed',
});

const icon = {
  width: 24,
  height: 24,
  flexShrink: 0,
  marginTop: '-1px',
  marginRight: variables.gap.small,
  color: 'var(--color-text-medium-emphasis)',
};

export const inactiveIcon = css(icon).toString();

export const inactiveIconDisabled = css(icon, {
  opacity: 0.3,
}).toString();

export const activeIcon = css(icon, {
  color: `var(--color-primary, ${colors.primary})`,
}).toString();

export const activeIconDisabled = css(icon, {
  color: `var(--color-primary, ${colors.primary})`,
  opacity: 0.3,
}).toString();

export const radio = css({
  display: 'none',
});

export const content = css({
  flexGrow: 1,
  color: 'var(--color-text-high-emphasis)',
});

export const itemRow = css({
  alignContent: 'stretch',
  alignItems: 'baseline',
}).toString();

export const itemRowDisabled = css({
  opacity: 0.3,
});

export const itemSpacer = css({
  marginLeft: 16,
});

export const itemColumn = css({
  display: 'block',
  width: '50%',
  '&:first-of-type': {
    paddingRight: variables.gap.small,
  },
  '&:last-of-type': {
    textAlign: 'right',
  },
}).toString();
