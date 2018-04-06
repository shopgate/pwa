import { css } from 'glamor';
import variables from 'Styles/variables';

const drawer = css({
  width: '100%',
  background: 'black',
  padding: '7px 24px',
  bottom: [
    `${variables.tabBar.height}px`,
    `calc(${variables.tabBar.height}px + var(--safe-area-inset-bottom))`,
  ],
}).toString();

export default {
  drawer,
};
