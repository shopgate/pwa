import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const closeButton = css({
  lineHeight: 1,
  outline: 0,
  padding: 0,
  minWidth: themeConfig.variables.navigator.height,
  height: themeConfig.variables.navigator.height,
  position: 'relative',
  zIndex: 2,
}).toString();

const closeIcon = css({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}).toString();

const title = css({
  fontSize: '1.25rem',
  fontWeight: 500,
  position: 'relative',
  alignItems: 'center',
  padding: `0 ${themeConfig.variables.gap.big}px`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  alignSelf: 'center',
}).toString();

export default {
  closeButton,
  closeIcon,
  title,
};
