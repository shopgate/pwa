// @flow
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export const messagesContainerCard = css({
  background: colors.light,
  padding: `0 0 ${variables.gap.big}px 0`,
}).toString();

export const messagesCard = css({
  borderRadius: '5px 5px 0 0',
  padding: `${variables.gap.small}px ${variables.gap.big * 0.875}px`,
}).toString();

export const messagesContainerLine = css({
  background: colors.light,
  padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
}).toString();

export const messagesLine = css({
  borderRadius: 4,
  padding: `${variables.gap.big / 2}px ${variables.gap.big}px`,
  lineHeight: 1.125,
}).toString();
