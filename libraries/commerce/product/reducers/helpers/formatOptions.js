/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { OPTION_TYPE_TEXT } from '../../constants';

/**
 * Formats the options from the API to a format our frontend needs.
 * @param {Object} options Product ptions
 * @return {Array} The formatted options
 */
const formatOptions = options => options.map((option) => {
  let { values } = option;
  const { type } = option;

  if (values) {
    values = values.map(value => ({
      ...value,
      unitPriceModifier: value.unitPriceModifier || 0,
    }));
  }

  let unitPriceModifier;

  if (type === OPTION_TYPE_TEXT) {
    unitPriceModifier = option.unitPriceModifier || 0;
  }

  return {
    ...option,
    unitPriceModifier,
    values,
  };
});

export default formatOptions;
