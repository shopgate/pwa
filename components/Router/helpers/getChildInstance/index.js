/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Returns the instance of the first child component.
 * @param {*} component The component instance.
 * @returns {Object}
 */
const getChildInstance = component =>
  // eslint-disable-next-line no-underscore-dangle
  component._reactInternalInstance._renderedComponent._renderedComponent._instance;

export default getChildInstance;
