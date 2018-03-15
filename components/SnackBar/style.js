import { css } from 'glamor';
import variables from 'Styles/variables';

const drawer = css({
  width: '100%',
  padding: `${variables.gap.big}px`,
  bottom: [
    `${variables.tabBar.height}px`,
    `calc(${variables.tabBar.height}px + var(--safe-area-inset-bottom))`,
  ],
  zIndex: 5,
}).toString();

export default {
  drawer,
};
