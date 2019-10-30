import { PipelineRequest, logger } from '@shopgate/pwa-core';
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

    return new PipelineRequest(SHOPGATE_CMS_GET_MENU)
      .setInput({ id })
      .dispatch()
      .then((response) => {
        dispatch(receiveMenu(id, response.entries));
        return response;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorMenu(id));
        return error;
      });
  };
}

export default fetchMenu;
