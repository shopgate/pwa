/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The transition definitions.
 * @module templates/styles/transitions
 */

/**
 * The transition duration in milliseconds.
 * @type {number}
 */
const viewTransitionDuration = 300;

/**
 * The transition definition for views.
 * @type {string}
 */
const viewTransition =
  `opacity ${viewTransitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1),` +
  `transform ${viewTransitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
;

/**
 * The not animating transition definition.
 * @type {Object}
 */
const viewNoneDefault = {
  transform: 'translate3d(0, 0, 0)',
  opacity: 1,
  zIndex: 1,
  transition: viewTransition,
};

/**
 * All the view transitions.
 * @type {Object}
 */
const views = {
  none: {
    base: viewNoneDefault,
    appear: viewNoneDefault,
    enter: viewNoneDefault,
    leave: viewNoneDefault,
  },
  forward: {
    base: {
      transform: 'translate3d(100%, 0, 0)',
      opacity: 1,
      zIndex: 2,
      transition: viewTransition,
    },
    appear: {
      transform: 'translate3d(0, 0, 0)',
      opacity: 1,
      zIndex: 2,
      transition: viewTransition,
    },
    enter: {
      transform: 'translate3d(0, 0, 0)',
      opacity: 1,
      zIndex: 2,
      transition: viewTransition,
    },
    leave: {
      opacity: 0.5,
      transform: 'translate3d(-25%, 0, 0)',
      zIndex: 1,
      transition: viewTransition,
    },
  },
  backward: {
    base: {
      transform: 'translate3d(-25%, 0, 0)',
      opacity: 0.5,
      zIndex: 1,
      transition: viewTransition,
    },
    appear: {
      transform: 'translate3d(0, 0, 0)',
      opacity: 1,
      zIndex: 1,
      transition: viewTransition,
    },
    enter: {
      transform: 'translate3d(0, 0, 0)',
      opacity: 1,
      zIndex: 1,
      transition: viewTransition,
    },
    leave: {
      opacity: 1,
      transform: 'translate3d(100%, 0, 0)',
      zIndex: 2,
      transition: viewTransition,
    },
  },
};

/**
 * The image transition definition.
 * @type {string}
 */
const imageTransition = 'opacity 300ms cubic-bezier(0.4, 0.0, 0.2, 1)';

/**
 * The image transitions.
 * @type {Object}
 */
const images = {
  base: {
    opacity: 0,
    transition: imageTransition,
  },
  appear: {
    opacity: 1,
    transition: imageTransition,
  },
  enter: {
    opacity: 1,
    transition: imageTransition,
  },
  leave: {
    opacity: 0,
    transition: imageTransition,
  },
};

export default {
  views,
  images,
};
