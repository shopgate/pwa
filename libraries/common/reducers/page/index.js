import {
  REQUEST_PAGE_CONFIG,
  RECEIVE_PAGE_CONFIG,
  ERROR_PAGE_CONFIG,
  APP_WILL_START,
} from '../../constants/ActionTypes';

/**
 * Enrich the widget data.
 * @param {Object} action The action that was received.
 * @return {Object} An enriched set of widgets.
 */
const enrichWidgets = action =>
  action.config.widgets.map((widget, index) => ({
    ...widget,
    id: `${action.pageId}-${index}-${widget.type}`,
  }));

/**
 * The page config reducer.
 * @param {Object} [state={}] The current application state.
 * @param {Object} action The action object.
 * @return {Object} The store data.
 */
export default function pageReducer(state = {}, action) {
  switch (action.type) {
    case REQUEST_PAGE_CONFIG:
      return {
        ...state,
        [action.pageId]: {
          ...state[action.pageId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PAGE_CONFIG: {
      return {
        ...state,
        [action.pageId]: {
          title: action.config.title,
          widgets: enrichWidgets(action),
          isFetching: false,
          expires: Date.now() + 3600000, // One hour
        },
      };
    }
    case ERROR_PAGE_CONFIG: {
      return {
        ...state,
        [action.pageId]: {
          ...state[action.pageId],
          isFetching: false,
          expires: 0,
        },
      };
    }
    case APP_WILL_START: {
      return Object.keys(state).reduce((newState, pageId) => {
        // eslint-disable-next-line no-param-reassign
        newState[pageId].expires = 0;
        return newState;
      }, { ...state });
    }

    default:
      return state;
  }
}
