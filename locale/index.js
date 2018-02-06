/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import extensionTranslations from 'Extensions/translations';
import mergeTranslations from '@shopgate/pwa-common/helpers/i18n/mergeTranslations';

// eslint-disable-next-line import/no-dynamic-require
const themeTranslations = require(`./${process.env.LANG}.json`);

export default mergeTranslations(extensionTranslations, themeTranslations);
