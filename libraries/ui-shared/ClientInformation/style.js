import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const wrapper = css({
  position: 'relative',
  textAlign: 'center',
  color: themeConfig.colors.shade9,
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
  padding: `0 ${themeConfig.variables.gap.big}px`,
}).toString();

export default {
  wrapper,
  unselectable,
  deviceId,
};
