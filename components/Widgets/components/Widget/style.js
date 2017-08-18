/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';

const content = cxs({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
});

/**
 * Calculates the height of a widget.
 * @param {number} base The cell size of the widget grid.
 * @param {number} rows The number of rows to use.
 * @returns {Function}
 */
const height = (base, rows) => cxs({
  display: 'block',
  position: 'absolute',
  height: `${Math.ceil(base * rows)}px`,
});

/**
 * Calculates the left offset based on the given number of columns as a faction of 12.
 * @param {number} offset The number of columns to offset by.
 * @returns {Function}
 */
const left = (offset) => {
  if (offset === 0) {
    return '';
  }

  return cxs({
    left: `${((offset * 100) / 12).toFixed(5)}%`,
  });
};

/**
 * Calculates the top offset based on the given cell size and row number.
 * @param {number} base The cell size of the widget grid.
 * @param {number} offset The number of columns to offset by.
 * @returns {Function}
 */
const top = (base, offset) => {
  if (offset === 0) {
    return '';
  }

  return cxs({
    top: `${Math.ceil(offset * base)}px`,
  });
};

/**
 * Calculates the width based on the given number of columns as a faction of 12.
 * @param {number} columns The number of columns to use.
 * @returns {Function}
 */
const width = (columns) => {
  if (columns === 12) {
    return cxs({
      width: '100%',
    });
  }

  return cxs({
    width: `${((columns * 100) / 12).toFixed(5)}%`,
  });
};

export default {
  content,
  height,
  left,
  top,
  width,
};
