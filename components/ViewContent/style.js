import cxs from 'cxs';
import { light } from '../../styles/colors';
import variables from '../../styles/variables';

/**
 * Creates the container style.
 * @param {boolean} hasNavigator Whether to add the top offset when the navigator is visible.
 * @return {string} The container style class.
 */
const container = (hasNavigator = true) => cxs({
  background: light,
  overflow: 'auto',
  overflowScrolling: 'touch',
  WebkitOverflowScrolling: 'touch',
  width: '100%',
  position: 'absolute',
  top: hasNavigator ? variables.navigator.height : 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  ':before': {
    position: 'fixed',
    display: 'block',
    top: 0,
    width: '100%',
    height: hasNavigator ? variables.navigator.height : 0,
    zIndex: 3,
    content: '""',
    transition: 'box-shadow 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
});

const containerShaded = cxs({
  ':before': {
    boxShadow: variables.navigator.shadow,
  },
});

export default {
  container,
  containerShaded,
};
