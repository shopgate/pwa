export const ORDER_STATUS_NEW = 'new';
export const ORDER_STATUS_OPEN = 'open';
export const ORDER_STATUS_REJECTED = 'rejected';
export const ORDER_STATUS_CANCELED = 'canceled';
export const ORDER_STATUS_READY = 'ready';
export const ORDER_STATUS_FULFILLED = 'fulfilled';
export const ORDER_STATUS_COMPLETED = 'completed';
export const ORDER_STATUS_IN_PROGRESS = 'inProgress';
// Does not come from the API
export const ORDER_STATUS_SUBMITTED = 'submitted';

const orderStatusMapping = {
  [ORDER_STATUS_NEW]: ORDER_STATUS_SUBMITTED,
  [ORDER_STATUS_OPEN]: ORDER_STATUS_SUBMITTED,
  [ORDER_STATUS_IN_PROGRESS]: ORDER_STATUS_IN_PROGRESS,
  [ORDER_STATUS_READY]: ORDER_STATUS_READY,
  [ORDER_STATUS_FULFILLED]: ORDER_STATUS_COMPLETED,
  [ORDER_STATUS_COMPLETED]: ORDER_STATUS_COMPLETED,
  [ORDER_STATUS_CANCELED]: ORDER_STATUS_CANCELED,
  [ORDER_STATUS_REJECTED]: ORDER_STATUS_CANCELED,
};

/**
 * Retrieves a final mapped order status of an original order status.
 * @param {string} orderStatus The original order status
 * @returns {string}
 */
export const getEngageOrderStatus = orderStatus =>
  orderStatusMapping[orderStatus] || orderStatus;

export const LINE_ITEM_STATUS_OPEN = 'open';
export const LINE_ITEM_STATUS_IN_PROGRESS = 'inProgress';
export const LINE_ITEM_STATUS_REJECTED = 'rejected';
export const LINE_ITEM_STATUS_CANCELED = 'canceled';
export const LINE_ITEM_STATUS_FULFILLED = 'fulfilled';

// Does not come from the API
export const LINE_ITEM_STATUS_PENDING = 'pending';
export const LINE_ITEM_STATUS_UNAVAILABLE = 'unavailable';

export const LINE_ITEM_SUB_STATUS_SUBSTITUTED = 'substituted';
export const LINE_ITEM_SUB_STATUS_REPLACED = 'replaced';

const lineItemInactiveStatuses = [{
  status: LINE_ITEM_STATUS_CANCELED,
  subStatus: null,
}, {
  status: LINE_ITEM_STATUS_CANCELED,
  subStatus: LINE_ITEM_SUB_STATUS_SUBSTITUTED,
}];

/**
 * Retrieves a final mapped line item status of an original line item status.
 * @param {string} lineItemStatus The original line item status
 * @param {string} lineItemSubStatus The original line item sub status
 * @returns {string}
 */
export const getEngageLineItemStatus = (lineItemStatus, lineItemSubStatus) => {
  const active = !lineItemInactiveStatuses.find(
    entry =>
      entry.status === lineItemStatus && entry.subStatus === lineItemSubStatus
  );

  return {
    status: lineItemStatus,
    active,
  };
};

