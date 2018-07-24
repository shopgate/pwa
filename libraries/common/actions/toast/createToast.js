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
export default function createToastAction(options) {
  return (dispatch) => {
    dispatch(createToast({
      ...defaultToastOptions,
      ...options,
    }));
  };
}
