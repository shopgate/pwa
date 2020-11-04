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
        return result.concat(getExternalScripts(node.childNodes, callback, false));
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

  /**
   * Filters out unwanted nodes.
   * @param {Object} nodeList A node list.
   * @returns {Object}
   */
  const filterBlacklistedNodes = nodeList =>
    nodeList.map((node) => {
      // We don't care about script tags.
      if (node.tagName === 'SCRIPT') {
        return null;
      }

      if (node.tagName === 'IMG') {
        // Images with a relative path won't work so we will remove them here.
        if (!node.getAttribute('src').startsWith('http')) {
          return null;
        }
      }

      if (node.childNodes.length > 0) {
        const filteredNodes = filterBlacklistedNodes(Array.from(node.childNodes));

        /* eslint-disable no-param-reassign */
        // Resets / Clears all children so it can be replaced with the filtered ones.
        node.innerHTML = '';
        /* eslint-enable no-param-reassign */

        filteredNodes.forEach(child => node.appendChild(child));
      }

      return node;
    }).filter(node => node !== null);

  filterBlacklistedNodes(nodesArray).forEach((node) => {
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
 * @deprecated Replaced by the EmbeddedVideos collection system.
 */
export const handleYouTube = (container) => {
  const youtubeIframes = container.querySelectorAll('iframe[src*="youtube.com"]');

  youtubeIframes.forEach((node, index) => {
    let { src } = node;

    // Is it really needed? We just queried for iframes WITH src attribute.
    if (!src) {
      return;
    }

    // Enable the js api
    if (src.includes('enablejsapi=0')) {
      src = src.replace('enablejsapi=0', 'enablejsapi=1');
    }

    if (!src.includes('enablejsapi')) {
      const queryChar = src.includes('?') ? '&' : '?';
      src += `${queryChar}enablejsapi=1`;
    }

    // Set controls to avoid the iframe not being resumable because of controls=0 param on ios.
    if (!src.includes('controls')) {
      src += '&controls=1';
    } else if (src.includes('controls=0')) {
      src = src.replace('controls=0', 'controls=1');
    }

    youtubeIframes[index].src = src;
  });

  /**
   * Stops the player when a native app event is triggered when a webview gets hidden or when the
   * user navigated to some other page.
   */
  event.addCallback('routeDidChange', () => { stopPlayer(youtubeIframes); });
  event.addCallback('viewDidDisappear', () => { stopPlayer(youtubeIframes); });
};

/**
 * Gets all styles from DOM.
 * Important: DOM parser might and probably will add <style> tags into <head> while parsing
 * the html string.
 * @param {HTMLDocument} dom DOM.
 * @returns {NodeList}
 */
export const getStyles = dom => dom.querySelectorAll('style');
