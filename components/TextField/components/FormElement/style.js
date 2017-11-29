/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { css } from 'glamor';

/**
 * The styles for the input field.
 */
const input = css({
  position: 'absolute',
  padding: 1,
  width: '100%',
  top: 38,
  outline: 0,
}).toString();

/**
 * The styles for the multiLine.
 */
const multiLine = css({
  position: 'relative',
  marginTop: 38,
  padding: 1,
  width: '100%',
  outline: 0,
  height: 32,
  minHeight: 32,
}).toString();

export default {
  input,
  multiLine,
};
