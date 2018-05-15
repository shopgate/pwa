import { CREATE_TOAST } from '../../constants/ActionTypes';

let currentId = 0;
/**
 * Gets the next id.
 * @return {number}
 */
const getNextId = () => {
  currentId += 1;
  return currentId;
};

/**
 * Creates the dispatched CREATE_TOAST action object.
 * @param {Object} options The toast options.
 * @return {Object} A Redux action.
 */
const createToast = options => ({
  type: CREATE_TOAST,
  options: {
    ...options,
    id: getNextId(),
  },
});

export default createToast;
