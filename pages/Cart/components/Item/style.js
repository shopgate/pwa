import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const messagesContainer = css({
  background: colors.light,
  padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
});

const messages = css({
  borderRadius: 4,
  padding: `${variables.gap.small / 2}px ${variables.gap.small}px`,
  lineHeight: 1.125,
});

export default {
  messagesContainer,
  messages,
};
