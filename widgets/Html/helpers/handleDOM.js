/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import event from '@shopgate/pwa-core/classes/Event/index';

/**
 * Parses a collection of DOM nodes for external script tags.
 * @param {Array} nodes A collection of DOM nodes.
 * @param {Function} callback Will be called when a single script is loaded.
 * @param {boolean} isRoot Whether this is the root level of the given DOM tree.
 * @return {Array} A collection of external script tags.
 */
export const getExternalScripts = (nodes, callback, isRoot = true) => {
  const nodesArray = [].slice.call(nodes);

  const externalScripts = nodesArray.reduce((result, node) => {
    // We only want external scripts.
    if (node.tagName !== 'SCRIPT' || !node.src) {
      if (node.childNodes && node.childNodes.length) {
        return result.concat(
          getExternalScripts(node.childNodes, callback, false)
        );
      }
      return result;
    }

    // Create a new script tag.
    const script = document.createElement('script');

    script.type = node.type;
    script.src = node.src;
    script.async = node.async;
    script.onload = callback;
    script.onerror = callback;

    result.push(script);
    return result;
  }, []);

  if (!externalScripts.length && isRoot) {
    return callback();
  }

  return externalScripts;
};

/**
 * Parses a collection of DOM nodes for inline script tags.
 * @param {Array} nodes A collection of DOM nodes.
 * @return {Array} A collection of inline script tags.
 */
export const getInlineScripts = (nodes) => {
  const nodesArray = [].slice.call(nodes);

  return nodesArray.reduce((result, node) => {
    // We only want scripts.
    if (node.tagName !== 'SCRIPT' || node.src) {
      if (node.childNodes && node.childNodes.length) {
        return result.concat(getInlineScripts(node.childNodes));
      }
      return result;
    }

    // Create a new script tag.
    const script = document.createElement('script');

    script.type = node.type;
    script.textContent = node.innerText;

    result.push(script);
    return result;
  }, []);
};

/**
 * Parses a collection of DOM nodes for non-script tags.
 * @param {Array} nodes A collection of DOM nodes.
 * @return {Object} A DOM node containing the HTML content.
 */
export const getHTMLContent = (nodes) => {
  const contents = document.createElement('div');
  const nodesArray = [].slice.call(nodes);

  nodesArray.forEach((node) => {
    // We don't care about script tags.
    if (node.tagName === 'SCRIPT') {
      return;
    }

    contents.appendChild(node.cloneNode(true));
  });

  return contents;
};

/**
 * Checks if a DOM container already exist and creates a new one if it doesn't exist.
 * @param {string} containerID The HTML id attribute of the container.
 * @return {Object} The container DOM node.
 */
export const getDOMContainer = (containerID) => {
  let container = document.getElementById(containerID);

  if (container) {
    container.innerHTML = '';
  } else {
    container = document.createElement('div');
    container.id = containerID;
    document.body.appendChild(container);
  }

  return container;
};

/**
 * Stops a NodeList of youtube players.
 * @param {NodeList} players YouTube player iframes.
 */
const stopPlayer = (players) => {
  const cmdStop = '{"event":"command","func":"stopVideo","args":""}';

  players.forEach((node, index) => {
    const yt = players[index];
    if (yt.contentWindow && yt.contentWindow.postMessage) {
      yt.contentWindow.postMessage(cmdStop, '*');
    }
  });
};

/**
 * Handles YouTube iframes so that we are able to controll when the video should be stopped.
 * It should not play in the background when a tab/page has changed.
 * @param {NodeList} container HTML widget container.
 */
export const handleYouTube = (container) => {
  const youtubeIframes = container.querySelectorAll('iframe[src*="youtube.com"]');
  youtubeIframes[0].src += '&enablejsapi=1';

  youtubeIframes.forEach((node, index) => {
    let { src } = youtubeIframes[index];

    if (!src) {
      return;
    }

    // Enable the js api
    if (src.indexOf('enablejsapi=0') !== -1) {
      src = src.replace('enablejsapi=0', 'enablejsapi=1');
    }

    if (src.indexOf('enablejsapi') === -1) {
      const queryChar = src.indexOf('?') ? '&' : '?';
      src += `${queryChar}enablejsapi=1`;
    }

    // Set controls to avoid the iframe not being resumable because of controls=0 param on ios.
    if (src.indexOf('controls') === -1) {
      src += '&controls=1';
    } else if (src.indexOf('controls=0')) {
      src = src.replace('controls=0', 'controls=1');
    }

    youtubeIframes[index].src = src;
  });

  /**
   * Stops the player when a native app event is triggered when a webview gets hidden or when the
   * user navigated to some other page.
   */
  event.addCallback('openLink', () => { stopPlayer(youtubeIframes); });
  event.addCallback('viewDidDisappear', () => { stopPlayer(youtubeIframes); });
};
