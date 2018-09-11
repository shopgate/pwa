import {
  TOGGLE_NAVIGATOR_CART_ICON,
  TOGGLE_PROGRESS_BAR,
  SET_NAVIGATOR_BACKGROUND,
  SET_NAVIGATOR_COLOR,
  SET_ICON_SHADOW_ENABLED,
  SET_ICON_SHADOW_DISABLED,
  SET_SEARCH_ENABLED,
  SET_SEARCH_DISABLED,
  SET_TITLE_ENABLED,
  SET_TITLE_DISABLED,
  SET_NAVIGATOR_ENABLED,
  SET_NAVIGATOR_DISABLED,
} from './constants';

/**
 * Stores all the navigator information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (
  state = {
    backgroundColor: null,
    enabled: true,
    searchPhrase: '',
    showCartIcon: true,
    showIconShadow: false,
    showProgressBar: true,
    showSearch: true,
    showTitle: true,
    textColor: null,
  },
  action
) => {
  switch (action.type) {
    case TOGGLE_NAVIGATOR_CART_ICON:
      return {
        ...state,
        showCartIcon: action.active,
      };
    case TOGGLE_PROGRESS_BAR:
      return {
        ...state,
        showProgressBar: action.active,
      };
    case SET_NAVIGATOR_BACKGROUND:
      return {
        ...state,
        backgroundColor: action.color,
      };
    case SET_NAVIGATOR_COLOR:
      return {
        ...state,
        textColor: action.color,
      };
    case SET_ICON_SHADOW_ENABLED:
      return {
        ...state,
        showIconShadow: true,
      };
    case SET_ICON_SHADOW_DISABLED:
      return {
        ...state,
        showIconShadow: false,
      };
    case SET_SEARCH_ENABLED:
      return {
        ...state,
        showSearch: true,
      };
    case SET_SEARCH_DISABLED:
      return {
        ...state,
        showSearch: false,
      };
    case SET_TITLE_ENABLED:
      return {
        ...state,
        showTitle: true,
      };
    case SET_TITLE_DISABLED:
      return {
        ...state,
        showTitle: false,
      };
    case SET_NAVIGATOR_ENABLED:
      return {
        ...state,
        enabled: true,
      };
    case SET_NAVIGATOR_DISABLED:
      return {
        ...state,
        enabled: false,
      };
    default:
      return state;
  }
};
