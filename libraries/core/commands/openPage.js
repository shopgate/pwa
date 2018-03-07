/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AppCommand from '../classes/AppCommand';

/**
 * Sends an openPage command to the app.
 * @param {Object} params The command parameters
 * @param {string} params.src The URL which shall be loaded
 * @param {string} params.previewSrc The URL which shall be loaded as preview content.
 * @param {boolean} params.emulateBrowser Rendering behaviour of loading page.
 *   If TRUE, the page will be rendered as normal browser.
 * @param {string} params.targetTab Target tab for the page.
 * @param {string} params.title The title of the opened page
 * @param {Object} params.navigationBarParams Parameters for the navigation bar.
 */
export default (params) => {
  const command = new AppCommand();

  command
    .setCommandName('openPage')
    .dispatch(params);
};
