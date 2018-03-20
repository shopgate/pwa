import createToast from '../../action-creators/toast/createToast';

/**
 * The toast defaults.
 * @type {Object}
 */
const defaultToastOptions = {
  action: null,
  actionOnClick: null,
  message: null,
  duration: 4000,
};

/**
 * Creates toast action.
 * @param {Object} options Options.
 * @returns {function}
 */
const createToastAction = options => (dispatch) => {
  dispatch(createToast({
    ...defaultToastOptions,
    ...options,
  }));
};

export default createToastAction;
