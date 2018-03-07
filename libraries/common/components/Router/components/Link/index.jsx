/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '../../helpers/parsed-link';
import style from './style';

/**
 * Link component.
 * @param {Object} props Props for the component.
 * @returns {JSX}
 */
export default class Link extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    href: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  /**
   * Opens the link.
   * @param {Object} e Event
   */
  handleOpenLink = (e) => {
    e.preventDefault();

    const link = new ParsedLink(this.props.href);
    link.open();
  };

  /**
   * Renders the component.
   * @returns {XML}
   */
  render() {
    const { className, children } = this.props;

    return (
      <div
        aria-hidden
        className={`${style} ${className}`}
        onClick={this.handleOpenLink}
        role="link"
      >
        {children}
      </div>
    );
  }
}
