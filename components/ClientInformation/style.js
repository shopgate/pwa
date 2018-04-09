import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const wrapper = css({
  position: 'relative',
  textAlign: 'center',
  color: colors.shade9,
  fontSize: 12,
  paddingBottom: 20,
}).toString();

const unselectable = css({
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  userSelect: 'none',
}).toString();

const deviceId = css({
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
  padding: `0 ${variables.gap.big}px`,
}).toString();

export default {
  wrapper,
  unselectable,
  deviceId,
};
