/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import get from 'lodash/get';
import { OS_ALL, TYPE_PHONE } from '../../constants/Device';
import {
  TRACKING_TARGET_ALL,
  TRACKING_TARGET_APPS,
  TRACKING_TARGET_APPS_SMARTPHONE,
} from '../../constants/Tracking';

/**
 * Extracts the action from the pathname.
 * @param {string} pathName The ULR pathname.
 * @returns {string} The action.
 */
export const getPathAction = pathName => pathName.split('/')[1];

/**
 * Selector that extracts the pathname from the current path.
 * @param {Object} state The current state.
 * @returns {string} The action.
 */
export const pathActionSelector = state => getPathAction(state.history.pathname);

/**
 * Checks if a given target is supported by the type
 * @param {string} target Tracking target
 * @param {Object} clientInformation Information about the current client
 * @returns {boolean}
 */
export function isTargetSupported(target, clientInformation) {
  const { type } = clientInformation;

  // Always use 'all' and 'apps'
  const validTargets = [TRACKING_TARGET_ALL, TRACKING_TARGET_APPS];

  // Add more valid targets depending on the platform/device
  if (type === TYPE_PHONE) {
    validTargets.push(TRACKING_TARGET_APPS_SMARTPHONE);
  }

  // Check if the given target matches any valid target
  return validTargets.indexOf(target) !== -1;
}

/**
 * Collects tracking configurations from the sgxs configuration, which match to the current client.
 * @param {Object} sgxsConfig The SGXS configuration
 * @param {Object} clientInformation Information about the current client
 * @return {Array}
 */
export const getRelevantConfigs = (sgxsConfig = {}, clientInformation = {}) => {
  const { stage: sgxsStage = '', trackers = [] } = sgxsConfig;

  return trackers.filter(({
    stage,
    shopgateAccount,
    os,
    target,
  }) => {
    /**
     * Only Shopgate tracking configurations contain a stage property. In case of the merchant
     * configurations we only get entries which match the stage, on which the client is running.
     */
    const validStage = !shopgateAccount || stage === sgxsStage;

    const validOs = !os || os === get(clientInformation, 'os') || os === OS_ALL;
    const validTarget = isTargetSupported(target, clientInformation);

    return validStage && validOs && validTarget;
  });
};
