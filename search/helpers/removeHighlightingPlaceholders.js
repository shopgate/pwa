/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Pipeline call adds $start$ and $end$ placeholders for higlighting purposes.
 *
 * Since the search autocomplete functionality doesn't highlight anything currently,
 * it needs to be stripped out.
 *
 * @param {Array} suggestions An array of strings.
 * @returns {Array}
 */
const removeHighlightingPlaceholers =
          suggestions => suggestions.map(item => item.replace(/\$start\$|\$end\$/g, ''));

export default removeHighlightingPlaceholers;
