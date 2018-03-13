import { css } from 'glamor';
import variables from 'Styles/variables';

const backgroundColor = 'rgba(249, 249, 249, 0.9)';

export default css({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: [
    `${variables.tabBar.height}px`,
    `calc(${variables.tabBar.height}px + var(--safe-area-inset-bottom))`,
  ],
  paddingBottom: [
    'var(--safe-area-inset-bottom)',
  ],
  zIndex: 10,
  alignItems: 'center',
  justifyContent: 'space-around',
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
  ':before': {
    ...variables.blur,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    content: '""',
    background: backgroundColor,
    zIndex: -1,
  },
}).toString();
