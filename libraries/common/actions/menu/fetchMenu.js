import { PipelineRequest, logger } from '@shopgate/pwa-core';
import * as pipelines from '../../constants/Pipelines';
import * as actions from '../../action-creators/menu';

/**
 * Get the custom service menu entries.
 * @param {string} id The menu id.
 * @return {Function} A redux thunk.
 */
export default function fetchMenu(id) {
  return (dispatch) => {
    dispatch(actions.requestMenu(id));

    new PipelineRequest(pipelines.SHOPGATE_CMS_GET_MENU)
      .setInput({ id })
      .dispatch()
      .then((response) => {
        dispatch(actions.receiveMenu(id, response.entries));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(actions.errorMenu(id));
      });
  };
}
