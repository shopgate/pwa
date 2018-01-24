/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { logger } from '@shopgate/pwa-core/helpers';
import CryptoJs from 'crypto-js';
import {
  getExternalScripts,
  getInlineScripts,
  getHTMLContent,
  getDOMContainer,
} from './handleDOM';
import decodeHTML from './decodeHTML';

/**
 * Receives custom HTML from a widget configuration, parses possible
 * script tags and executes them after loading external scripts.
 * @param {string} html The HTML string. It might contain script tags.
 * @param {boolean} decode Whether the html must be decoded.
 * @param {Object} settings The settings are used to create a unique ID.
 * @returns {string} The HTML without any script tags.
 */
const parseHTML = (html, decode, settings) => {
  const id = CryptoJs.MD5(JSON.stringify(settings)).toString();
  const container = getDOMContainer(`html-sanitizer-${id}`);

  try {
    const parser = new DOMParser();
    const unparsedHTML = decode ? decodeHTML(html) : html;
    // Parse the html string to a DOM object.
    const dom = parser.parseFromString(`<body>${unparsedHTML}</body>`, 'text/html');
    // How many onloads have been processed.
    let onloads = 0;

    let inlineScripts = [];
    let externalScripts = [];

    /**
     * Handles the onload events for external scripts.
     * @return {Array} The collection of external scripts.
     */
    const handleOnload = () => {
      onloads += 1;

      /**
       * If there are no external scripts or all external
       * scripts are loaded, handle the inline scripts.
       */
      if (!externalScripts.length || onloads === externalScripts.length) {
        inlineScripts.forEach((scriptTag) => {
          container.appendChild(scriptTag);
        });
      }

      return externalScripts;
    };

    // A collection of all the inline script tags.
    inlineScripts = getInlineScripts(dom.childNodes);
    // A collection of all the external script tags.
    externalScripts = getExternalScripts(dom.childNodes, handleOnload);

    // Append the external scripts.
    externalScripts.forEach((scriptTag) => {
      container.appendChild(scriptTag);
    });

    return getHTMLContent(dom.body.childNodes).innerHTML;
  } catch (err) {
    logger.error(err);
    return html;
  }
};

export default parseHTML;
