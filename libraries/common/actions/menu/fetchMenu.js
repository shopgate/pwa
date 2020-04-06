import { PipelineRequest } from '@shopgate/pwa-core';
import { SHOPGATE_CMS_GET_MENU } from '../../constants/Pipelines';
import {
  requestMenu,
  receiveMenu,
  errorMenu,
} from '../../action-creators/menu';

/**
 * Get the custom service menu entries.
 * @param {string} id The menu id.
 * @return {Function} A redux thunk.
 */
function fetchMenu(id) {
  return (dispatch) => {
    dispatch(requestMenu(id));

    const request = new PipelineRequest(SHOPGATE_CMS_GET_MENU)
      .setInput({ id })
      .dispatch();

    request
      .then(({ entries }) => {
        dispatch(receiveMenu(id, entries));
      })
      .catch(() => {
        dispatch(errorMenu(id));
      });

    return request;
  };
}

export default fetchMenu;
