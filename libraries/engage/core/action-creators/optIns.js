import {
  SOFT_OPT_IN_SHOWN,
  SOFT_OPT_IN_SELECTED,
  HARD_OPT_IN_SHOWN,
  HARD_OPT_IN_SELECTED,
  PERMISSION_STATUS_DENIED,
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_NOT_DETERMINED,
} from '@shopgate/engage/core/constants';

/**
 * @typedef {Object} OptInMeta
 * @property {string} permission Permission type the event is dispatched for
 */

/**
 * Sanitizes the meta object of opt in actions
 * @param {OptInMeta} meta The original meta object
 * @returns {Object} The sanitized meta object
 */
const sanitizeMeta = (meta = {}) => ({
  permission: 'other',
  ...meta,
});

/**
 * Creates the SOFT_OPT_IN_SHOWN Redux action object that's supposed to be dispatched when a
 * soft opt-in (e.g. push or tracking) was shown.
 * @param {Object} params Action params
 * @param {OptInMeta} params.meta Meta data for the action
 * @returns {Object} The Redux action object
 */
export const softOptInShown = ({ meta } = {}) => ({
  type: SOFT_OPT_IN_SHOWN,
  meta: sanitizeMeta(meta),
});

/**
 * Creates the SOFT_OPT_IN_SELECTED Redux action object that's supposed to be dispatched when a
 * a decision inside a soft opt-in (e.g. push or tracking) was taken.
 * @param {Object} params Action params
 * @param {"approved"|"denied"|"later"|"approvedAll"|"deniedAll"|"manage"} params.selection
 * User selection
 * @param {OptInMeta} params.meta Meta data for the action
 * @returns {Object} The Redux action object
 */
export const softOptInSelected = ({ selection, meta }) => ({
  type: SOFT_OPT_IN_SELECTED,
  selection,
  meta: sanitizeMeta(meta),
});

/**
 * Creates the HARD_OPT_IN_SHOWN Redux action object that's supposed to be dispatched when a
 * hard opt-in (native permission dialog) was shown.
 * @param {Object} params Action params
 * @param {string} params.permissionId Permission id the action was dispatched for
 * @param {OptInMeta} params.meta Meta data for the action
 * @returns {Object} The Redux action object
 */
export const hardOptInShown = ({ permissionId, meta }) => ({
  type: HARD_OPT_IN_SHOWN,
  permissionId,
  meta: sanitizeMeta(meta),
});

/**
 * Creates the HARD_OPT_IN_SELECTED Redux action object that's supposed to be dispatched when a
 * a decision inside a hard opt-in (native permission dialog) was taken.
 * @param {Object} params Action params
 * @param {string} params.permissionId Permission id the action was dispatched for
 * @param {string} params.status Permission status
 * @param {OptInMeta} params.meta Meta data for the action
 * @returns {Object} The Redux action object
 */
export const hardOptInSelected = ({ permissionId, status, meta }) => {
  let selection = 'other';

  switch (status) {
    case PERMISSION_STATUS_GRANTED:
      selection = 'approved';
      break;
    case PERMISSION_STATUS_DENIED:
      selection = 'denied';
      break;
    case PERMISSION_STATUS_NOT_DETERMINED:
      selection = 'later';
      break;
    default:
      break;
  }

  return ({
    type: HARD_OPT_IN_SELECTED,
    permissionId,
    selection,
    meta: sanitizeMeta(meta),
  });
};

