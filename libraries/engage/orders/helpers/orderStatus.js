import { i18n } from '@shopgate/engage/core';
import { getEngageOrderStatus, getEngageLineItemStatus } from '../constants';

/**
 * Generates a translated order status.
 * @param {string} status The status from the API.
 * @returns {string}
 */
export const getTranslatedOrderStatus = (status) => {
  const path = `order.status.order.${getEngageOrderStatus(status)}`;
  const translated = i18n.text(path);
  return translated !== path ? translated : status;
};

/**
 * Generates a translated line item status.
 * @param {string} status The status from the API.
 * @param {string} subStatus The sub status from the API.
 * @returns {string}
 */
export const getTranslatedLineItemStatus = (status, subStatus) => {
  const statusText = getEngageLineItemStatus(status, subStatus)?.status;
  const path = `order.status.line_item.${statusText}`;
  const translated = i18n.text(path);
  return translated !== path ? translated : status;
};

/**
 * Determines the active status of a line item.
 * @param {string} status The status from the API.
 * @param {string} subStatus The sub status from the API.
 * @returns {boolean}
 */
export const getLineItemActiveStatus = (status, subStatus) =>
  getEngageLineItemStatus(status, subStatus)?.active;
