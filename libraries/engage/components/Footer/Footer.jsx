import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import {
  APP_FOOTER_CONTENT_BEFORE,
  APP_FOOTER_CONTENT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { getAbsoluteHeight, getStyle } from '@shopgate/pwa-common/helpers/dom';
import { SHEET_EVENTS } from '@shopgate/pwa-ui-shared/Sheet';
import {
  footer,
  updateInsetBackgroundColor,
  updateFooterHeight,
} from './Footer.style';

const APP_FOOTER_ID = 'AppFooter';
const DATA_IGNORED = 'data-footer-inset-update-ignore';

/**
 * The footer component.
 */
class Footer extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  }

  /**
   * Sets up the DOM Mutation Observer to take care that the footer inset always has the correct
   * background color, which matches the background color of the last element within the footer.
   */
  componentDidMount() {
    this.performFooterUpdate();

    const observer = new MutationObserver((mutations) => {
      const update = mutations
        .filter(mutation => mutation.target.getAttribute(DATA_IGNORED) !== 'true').length > 0;

      if (update) {
        this.performFooterUpdate();
      }
    });

    observer.observe(this.ref.current, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    UIEvents.addListener(SHEET_EVENTS.OPEN, this.hide);
    UIEvents.addListener(SHEET_EVENTS.CLOSE, this.show);
  }

  /** @inheritDoc */
  componentWillUnmount() {
    UIEvents.removeListener(SHEET_EVENTS.OPEN, this.hide);
    UIEvents.removeListener(SHEET_EVENTS.CLOSE, this.show);
  }

  ref = React.createRef();

  /**
   * Retrieves the background color for the footer inset.
   * @param {NodeList} elements The DOM elements to inspect.
   * @returns {string|null}
   */
  getInsetBackgroundColor(elements) {
    /**
     * The background color of the bottom inset needs to identical to the last entry of the footer.
     * So we loop backwards to the elements to find the first visible one.
     */
    const color = Array.from(elements).reverse().reduce((result, element) => {
      const ignore = element.getAttribute(DATA_IGNORED) === 'true';

      if (result || ignore) {
        // Nothing to do, since the color was already determined or the element can be ignored.
        return result;
      }

      if (element.id === APP_FOOTER_ID) {
        // Inspect core portal.
        return this.getInsetBackgroundColor(element.children);
      }

      if ('clientHeight' in element) {
        // Take the background color of the last visible element from the end of the footer.
        return getStyle(element, 'backgroundColor');
      }

      // Nothing happened within this loop - proceed with the next one.
      return result;
    }, null);

    if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
      return null;
    }

    return color || null;
  }

  /** Perform hide action */
  hide = () => {
    if (this.ref.current) {
      updateFooterHeight(0);
    }
  }

  /** Perform show action */
  show = () => {
    if (this.ref.current) {
      updateFooterHeight(getAbsoluteHeight(this.ref.current));
    }
  }

  /**
   * Performs an update of the footer: background color, height.
   */
  performFooterUpdate() {
    if (this.ref.current) {
      updateFooterHeight(getAbsoluteHeight(this.ref.current));
      updateInsetBackgroundColor(this.getInsetBackgroundColor(this.ref.current.children));
    }
  }

  /**
   * Checks if the footer has visible content.
   * @returns {boolean}
   */
  hasVisibleContent() {
    if (this.ref.current) {
      const elements = this.ref.current.parentElement
        .querySelectorAll(`div.${footer.toString()} > *:not(#${APP_FOOTER_ID}), #${APP_FOOTER_ID} > *`);

      return Array
        .from(elements)
        .filter(element =>
          element.getAttribute(DATA_IGNORED) !== 'true' && element.clientHeight > 0).length > 0;
    }

    return false;
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <div className={footer} ref={this.ref}>
        <Portal name={APP_FOOTER_CONTENT_BEFORE} />
        <div id={APP_FOOTER_ID}>
          {this.props.children}
        </div>
        <Portal name={APP_FOOTER_CONTENT_AFTER} />
      </div>
    );
  }
}

export default Footer;
