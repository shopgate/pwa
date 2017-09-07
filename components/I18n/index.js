/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import I18nProvider from './components/I18nProvider';
import Placeholder from './components/Placeholder';
import Translate from './components/Translate';
import FormatDate from './components/FormatDate';
import FormatTime from './components/FormatTime';
import FormatPrice from './components/FormatPrice';

export default {
  Provider: I18nProvider,
  Text: Translate,
  Date: FormatDate,
  Time: FormatTime,
  Placeholder,
  Price: FormatPrice,
};
