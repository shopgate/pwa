// @flow
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

export const messagesContainer = css({
  background: colors.light,
  padding: `0 0 ${variables.gap.big}px 0`,
});

export const messages = css({
  borderRadius: '5px 5px 0 0',
  padding: `${variables.gap.small}px ${variables.gap.big * 0.875}px`,
});
