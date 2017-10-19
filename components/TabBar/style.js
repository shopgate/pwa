import { css } from 'glamor';
import variables from 'Styles/variables';

const backgroundColor = 'rgba(249, 249, 249, 0.85)';

const container = css({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: variables.tabBar.height,
  zIndex: 1,
  alignItems: 'center',
  justifyContent: 'space-around',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
  ':before': {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    content: '""',
    background: backgroundColor,
    ...variables.blur,
    zIndex: -1,
  },
}).toString();

export default {
  container,
};
