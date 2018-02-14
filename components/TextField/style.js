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
const container = {
  input: css({
    position: 'relative',
    paddingBottom: variables.gap.big,
    width: '100%',
  }).toString(),
  multiLine: css({
    position: 'relative',
    width: '100%',
  }).toString(),
};

export default {
  container,
};
