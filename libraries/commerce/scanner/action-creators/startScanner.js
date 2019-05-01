import { START_SCANNER } from '../constants';

/**
 * Creates the dispatched START_SCANNER action object.
 * @returns {Object}
 */
const startScanner = () => ({
  type: START_SCANNER,
});

export default startScanner;
