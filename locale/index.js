/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import extensionTranslations from 'Extensions/translations';
import isPlainObject from 'lodash/isPlainObject';
import defaultsDeep from 'lodash/defaultsDeep';

// eslint-disable-next-line import/no-dynamic-require
const themeTranslations = require(`./${process.env.LANG}.json`);
let extension = {};

if (isPlainObject(extensionTranslations)) {
  Object.keys(extensionTranslations).forEach((key) => {
    if (key.includes(process.env.LANG)) {
      extension = extensionTranslations[key];
    }
  });
}

export default defaultsDeep(extension, themeTranslations);
