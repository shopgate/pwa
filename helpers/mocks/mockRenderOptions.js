/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import PropTypes from 'prop-types';

const options = {
  context: {
    i18n: () => ({
      __(input) {
        if (input) {
          return 'translation';
        }
        return '';
      },
      _p: () => 'p',
      _d: () => 'd',
    }),
  },
  childContextTypes: {
    i18n: PropTypes.func,
  },
};

export default options;
