import {
  CREATE_MODAL,
  REMOVE_MODAL,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched CREATE_MODAL action object.
 * @param {Object} options The modal options.
 * @return {Object} The dispatched action object.
 */
export const createModal = options => ({
  type: CREATE_MODAL,
  options,
});

/**
 * Creates the dispatched REMOVE_MODAL action object.
 * @param {string} id The modal id to remove.
 * @return {Object} The dispatched action object.
 */
export const removeModal = id => ({
  type: REMOVE_MODAL,
  id,
});
