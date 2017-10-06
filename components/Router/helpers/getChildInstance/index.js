/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @TODO: Use the context to give all the children access to the livecycle hooks.

/**
 * Returns the instance of the first child component.
 * @param {Object} component The component instance.
 * @returns {Object}
 */
const getChildInstance = (component) => {
  if (!component) {
    return null;
  }

  // eslint-disable-next-line no-underscore-dangle
  const componentInstance = component._reactInternalInstance;

  if (!componentInstance) {
    return null;
  }

  // eslint-disable-next-line no-underscore-dangle
  const renderedComponent = componentInstance._renderedComponent;

  if (!renderedComponent) {
    return null;
  }

  // eslint-disable-next-line no-underscore-dangle
  const renderedChild = renderedComponent._renderedComponent;

  if (!renderedChild) {
    return null;
  }

  // eslint-disable-next-line no-underscore-dangle
  const childInstance = renderedChild._instanc;

  if (!childInstance) {
    return null;
  }

  return childInstance;
};

export default getChildInstance;
