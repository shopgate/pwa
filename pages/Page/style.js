import { css } from 'glamor';
import colors from 'Styles/colors';

const container = css({
  paddingTop: 60,
}).toString();

const widgetWrapper = css({
  background: colors.shade8,
}).toString();

export default {
  container,
  widgetWrapper,
};
