import event from '@shopgate/pwa-core/classes/Event';
import { logger } from '@shopgate/pwa-core/helpers';
import { shopCNAME } from '@shopgate/pwa-common/helpers/config';
import { history as defaultHistory } from '../../../../helpers/router';
import options from './options';
import actions from './actions';

/**
 * The parsed link class.
 */
class ParsedLink {
  /**
   * Returns shopgate domain.
   * @returns {string}
   */
  static get shopgateDomain() {
    return 'shopgate.com';
  }

  /**
   * Returns shopgate playground domain.
   * @returns {string}
   */
  static get shopgatePGDomain() {
    return 'shopgatepg.com';
  }

  /**
   * Checks if href looks like a shopgate shop link.
   * Shopgate shop links can have two variants. [shopName].shopgate.com or CNAME.
   * @param {string} href Href.
   * @returns {boolean}
   */
  static isShopgateShopLink(href) {
    // Doesn't start with http, not external link. No need to check further.
    if (!href.startsWith('http')) {
      return false;
    }

    const parsed = new URL(href);

    // Check if hostname is shop's CNAME
    if (
      typeof shopCNAME === 'string'
      && parsed.hostname === shopCNAME.toLowerCase()
    ) {
      return true;
    }

    // Check if link ends with shopgate.com. If not it is not a shopgate shop link.
    const isShopgatedomain =
            parsed.hostname.endsWith(this.shopgateDomain)
            || parsed.hostname.endsWith(this.shopgatePGDomain);

    if (!isShopgatedomain) {
      return false;
    }

    // If hostame is www.shopgate.com or just shopgate.com this is also not a shopgate shop link.
    if (
      [
        `www.${this.shopgateDomain}`,
        this.shopgateDomain,
      ]
        .includes(parsed.hostname)
    ) {
      return false;
    }

    return true;
  }
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
    const parser = new URL(
      this.href,
      `http://${this.constructor.shopgateDomain}`
    ); // We don't care about location
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

    if (this.constructor.isShopgateShopLink(this.href)) {
      // For shopgate links, we only pass the pathname.
      options.getSimpleLinkParserOptions.apply(
        this,
        [
          parser.pathname.split('/').splice(1),
          queryParams,
          parser.pathname,
          parser.search,
        ]
      );
      return;
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
   * @param {boolean} [callActions=true] When set to FALSE only openLink events will be triggered,
   *   but no router actions will be called.
   */
  open(history = defaultHistory, callActions = true) {
    this.getHandlers().forEach((handler) => {
      event.trigger('openLink', handler);
      if (callActions) {
        actions[handler.action](handler.options, history);
      }
    });
  }
}

export default ParsedLink;
