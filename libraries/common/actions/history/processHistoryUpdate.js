import { parseQueryStringToObject } from '../../helpers/router';
import { updateHistory } from '../../action-creators/history';

/**
 * Processes any change of the history and therefore enables hooks for specific route changes.
 * @param {Object} historyProps The history object.
 * @return {Function} A redux thunk.
 */
const processHistoryUpdate = historyProps => (dispatch) => {
  // Extract search query string and other props.
  const { search, ...processedProps } = historyProps;

  // Parse search query string to an object.
  processedProps.queryParams = parseQueryStringToObject(search);

  dispatch(updateHistory(processedProps));
};

export default processHistoryUpdate;
