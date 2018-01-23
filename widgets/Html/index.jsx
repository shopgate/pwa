/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { history } from '@shopgate/pwa-common/helpers/router';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import parseHTML from './helpers/parseHTML';
import styles from './style';

/**
 * The custom HTML widget.
 */
class Html extends Component {
  /**
   * The widget properties.
   * @type {Object}
   */
  static propTypes = {
    settings: PropTypes.shape({
      html: PropTypes.string.isRequired,
    }).isRequired,
  };

  /**
   * Get the escaped HTML from the props, remove and execute the scripts (if any) and put
   * it unescaped in the state.
   * @param {Object} props The component props.
   * @param {Object} context The component context.
   */
  constructor(props, context) {
    super(props, context);

    this.state = {
      html: parseHTML(props.settings.html, props.settings),
    };
  }

  /**
   * Registers the event handler for when the user taps inside the widget.
   */
  componentDidMount() {
    this.htmlContainer.addEventListener('click', this.handleTap, true);
  }

  /**
   * Only update if the HTML changed.
   * @param  {Object} nextProps The next props for the component.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.settings.html !== this.props.settings.html;
  }

  /**
   * Removes the event handler.
   */
  componentWillUnmount() {
    this.htmlContainer.removeEventListener('click', this.handleTap, true);
  }

  /**
   * If the user tapped a link element, prevent the default behaviour
   * and handle them via ParsedLink.
   * @param {Object} event The touchstart event.
   */
  handleTap = (event) => {
    const aTag = event.target.closest('a');

    if (aTag && aTag.attributes.href) {
      const href = aTag.attributes.href.value;
      const link = new ParsedLink(href);

      event.preventDefault();
      link.open(history);
    }
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <div
        className={styles}
        dangerouslySetInnerHTML={{ __html: this.state.html }}
        ref={(domElm) => { this.htmlContainer = domElm; }}
      />
    );
  }
}

export default Html;
