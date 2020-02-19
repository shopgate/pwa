// @flow
import { css } from 'glamor';
import { isIOSTheme } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables, shadows } = themeConfig;

export const wrapper = css({
  background: colors.light,
  boxShadow: shadows.cart.paymentBar,
  position: 'relative',
  zIndex: 2,
});

export const container = css({
  padding: isIOSTheme() ? variables.gap.small : variables.gap.big,
  paddingBottom: 0,
  lineHeight: 1.45,
  flexWrap: 'wrap',
  flexDirection: 'column',
  minWidth: 'auto',
}).toString();

export const checkoutButton = css({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const checkoutButtonContainer = css({
  background: colors.light,
  alignItems: 'center',
  padding: isIOSTheme() ? variables.gap.small : variables.gap.big,
  position: 'relative',
  zIndex: 2,
});
