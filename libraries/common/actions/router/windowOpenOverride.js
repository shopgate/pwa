import { WINDOW_OPEN_OVERRIDE } from '../../constants/ActionTypes';

/**
 * Indicates a call to window.open e.g. invoked by an external SDK.
 *
 * @param {Object} params Action params
 * @param {string} params.pathname The pathname window.open was called with
 * @returns {Object}
 */
export const windowOpenOverride = ({
  pathname,
}) => ({
  type: WINDOW_OPEN_OVERRIDE,
  pathname,
});
