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
 * @property {string} permission Meta data permission
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
 * Lorem Ipsum
 * @param {Object} params Action params
 * @param {OptInMeta} params.meta Meta data for the action
 * @returns {Object} The Redux action object
 */
export const softOptInShown = ({ meta } = {}) => ({
  type: SOFT_OPT_IN_SHOWN,
  meta: sanitizeMeta(meta),
});

/**
 * Lorem Ipsum
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
 * Lorem Ipsum
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
 * Lorem Ipsum
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

