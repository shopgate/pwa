/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { css } from 'glamor';

/**
 * The styles for the container element.
 */
const ratingLine = css({
  minHeight: 40,
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}).toString();

/**
 * The styles for the rating stars.
 */
const scale = css({
  position: 'relative',
  float: 'right',
});

/**
 * The styles for the error message.
 */
const error = css({
  textAlign: 'center',
  clear: 'both',
  bottom: -16,
}).toString();

export default {
  error,
  scale,
  ratingLine,
};
