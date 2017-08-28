import cxs from 'cxs';
import variables from 'Styles/variables';

const wrapper = cxs({
  alignItems: 'center',
  position: 'fixed',
  height: variables.filterbar.height,
  width: '100%',
  zIndex: 3,
  top: variables.navigator.height,
  willChange: 'transform',
});

const shaded = cxs({
  boxShadow: variables.navigator.shadow,
});

export default {
  wrapper,
  shaded,
};
