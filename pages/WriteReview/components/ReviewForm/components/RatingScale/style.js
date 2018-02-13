/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { css } from 'glamor';
import variables from 'Styles/variables';

/**
 * The styles for the container element.
 */
const ratingLine = css({
  marginBottom: variables.gap.bigger,
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
}).toString();

/**
 * The styles for the rating scale.
 */
const scale = css({
  position: 'relative',
  float: 'right',
  marginRight: '-0.25em',
  flex: 'none',
});

/**
 * The styles for the rating scale label.
 */
const label = css({
  flex: 1,
}).toString();

/**
 * The styles for the error message.
 */
const error = css({
  textAlign: 'center',
  clear: 'both',
  bottom: '-1.5em',
  lineHeight: 'initial',
}).toString();

export default {
  error,
  scale,
  ratingLine,
  label,
};
