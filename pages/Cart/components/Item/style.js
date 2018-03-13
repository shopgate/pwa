import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const messagesContainer = css({
  background: colors.light,
  padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
}).toString();

const messages = css({
  borderRadius: 4,
  padding: `${variables.gap.small / 2}px ${variables.gap.small}px`,
  lineHeight: 1.125,
}).toString();

export default {
  messagesContainer,
  messages,
};
