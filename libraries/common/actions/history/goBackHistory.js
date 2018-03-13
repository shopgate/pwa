import { history } from '../../helpers/router';

/**
 * Goes back one or more entries within the browse history.
 * @param {number} [amount=1] The number of steps to go back. Defaults to 1.
 * @returns {Function} A redux thunk.
 */
const goBackHistory = (amount = 1) => () => {
  if (amount > 0) {
    history.go(-amount);
  }
};

export default goBackHistory;
