/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import ActionButton from 'Components/ActionButton';

/**
 * Simple wrapper around ActionButton so it's easy to render buttons which behave as links.
 */
class ButtonLink extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    href: PropTypes.string.isRequired,
    noGap: PropTypes.bool,
  };

  static defaultProps = {
    noGap: false,
  };

  /**
   * Prepares the link.
   * @param {Object} props Props
   */
  constructor(props) {
    super(props);
    this.link = new ParsedLink(this.props.href);
  }

  /**
   * Opens the given url on click.
   * @returns {undefined}
   */
  handleClick = () => this.link.open();

  /**
   * Renders an ActionButton and handles link handling.
   * @returns {XML}
   */
  render() {
    return (
      <ActionButton onClick={this.handleClick} type="secondary" noGap={this.props.noGap}>
        {this.props.children}
      </ActionButton>
    );
  }
}

export default ButtonLink;
