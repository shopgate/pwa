import { css } from 'glamor';
import { useScrollContainer } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const container = css({
  background: `var(--page-background-color, ${colors.background})`,
  flexGrow: 1,
  padding: variables.gap.big,
  paddingBottom: variables.emptyPage.buttonVerticalGap,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  ...(useScrollContainer() ? {} : { paddingTop: 100 }),
}).toString();

const iconContainer = css({
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
}).toString();

const title = css({
  paddingTop: variables.emptyPage.titleTopGap,
}).toString();

export default {
  container,
  iconContainer,
  title,
};
