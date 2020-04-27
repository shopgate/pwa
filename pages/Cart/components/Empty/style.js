import { css } from 'glamor';
import { useScrollContainer } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const wrapper = css({
  display: 'flex',
  flexDirection: 'column',
  background: `var(--page-background-color, ${colors.shade8})`,
  textAlign: 'center',
  height: '100%',
  ...(useScrollContainer() ? {} : { paddingTop: 100 }),
}).toString();

const container = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  flexGrow: '1',
  flexShrink: '0',
}).toString();

const icon = css({
  width: variables.emptyPage.icon,
}).toString();

const title = css({
  textAlign: 'center',
  paddingTop: variables.emptyPage.titleTopGap,
}).toString();

const buttonContainer = css({
  flexGrow: '0',
  padding: `${variables.emptyPage.buttonVerticalGap}px ${variables.gap.big}px`,
}).toString();

const button = css({
  width: '100%',
}).toString();

export default {
  wrapper,
  container,
  icon,
  title,
  buttonContainer,
  button,
};
