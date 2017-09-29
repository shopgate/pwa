/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import event from '@shopgate/pwa-core/classes/Event';
import { logger } from '@shopgate/pwa-core/helpers';
import { history as defaultHistory } from '../../helpers/router';
import options from './options';
import actions from './actions';

/**
 * The parsed link class.
 */
class ParsedLink {
  /**
   * Parses a link based on its href.
   * @param {string} href Link href.
   */
  constructor(href) {
    this.href = options.convertDeepLink(href);
    this.originalHref = href;
    this.actions = [];

    /**
     * Looks for an absolute path
     * @type {RegExp}
     */
    const regexAbsoluteLink = /^\/.*$/;

    /**
     * Parses query parameters to an object
     * @type {RegExp}
     */
    const regexQueryParams = /[?&]([^=#]+)=([^&#]*)/g;

    // Look for an actual url
    const parser = new URL(this.href, 'http://shopgate.com'); // We don't care about location
    const queryParams = {};

    // Parse url queries
    if (parser.search) {
      let match = 1;

      while (match) {
        match = regexQueryParams.exec(parser.search);

        if (!match) {
          break;
        }

        queryParams[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
      }
    }

    // Is absolute link
    const isAbsolute = regexAbsoluteLink.exec(this.href) !== null;
    if (isAbsolute) {
      options.getSimpleLinkParserOptions.apply(this, [parser.pathname.split('/').splice(1), queryParams, this.href, parser.search]);
      return;
    }

    options.getProtocolParserOptions.apply(this, [parser.protocol.replace(':', ''), this.href]);
  }

  /**
   * Adds a link action.
   * @param {string} action Name of the action.
   * @param {Object} opt Options for the action.
   */
  addLinkAction(action, opt) {
    if (!actions[action]) {
      logger.warn(`Tried to add invalid url action: ${action}`);
      return;
    }

    this.actions.push({
      action,
      options: opt,
    });
  }

  /**
   * Called when parsing the link failed for some reason.
   * @param {string} message Message that describes the issue.
   */
  invalidLink(message) {
    logger.warn(`Could not parse link: ${message}`);
    this.invalid = true;
  }

  /**
   * Returns all active handlers
   * @returns {Array}
   */
  getHandlers() {
    return this.actions;
  }

  /**
   * Returns the original href.
   * @returns {string|*}
   */
  getOriginalHref() {
    return this.originalHref;
  }

  /**
   * Returns the href.
   * @returns {string|*}
   */
  getHref() {
    return this.href;
  }

  /**
   * Opens the link
   * @param {Object} [history] The history object of react-router
   */
  open(history = defaultHistory) {
    if (this.invalid) {
      logger.warn('Tried to open invalid link..');
      return;
    }

    this.getHandlers().forEach((handler) => {
      event.trigger('openLink', handler);
      actions[handler.action](handler.options, history);
    });
  }
}

export default ParsedLink;
