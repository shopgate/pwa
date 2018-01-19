/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { logger } from '@shopgate/pwa-core/helpers';

/**
 * The Portal component.
 * Hooks its child elements into a portal that can be accessed by a ID.
 * @extends PureComponent
 */
class Portal extends PureComponent {
  static propTypes = {
    /**
     * The ID of the portal.
     * @type {string}
     */
    id: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]),
    replace: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    replace: false,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.initial = true;
    this.portal = [];
  }

  /**
   * Sets initial to false.
   */
  componentDidMount() {
    this.initial = false;
  }

  /**
   * Renders the component.
   * @return {React.Portal}
   */
  render() {
    const { id, children, replace } = this.props;

    if (!id) {
      logger.error('Portal: No ID supplied!');
      return null;
    }

    if (!children) {
      return null;
    }

    // Grab the corresponding DOM element.
    const elements = document.querySelectorAll(`[data-key='${id}']`);

    if (!elements.length) {
      logger.warn(`Portal: No DOM element for ID '${id}' could be found!`);
      return null;
    }

    // Create the new portals.
    elements.forEach((el) => {
      if (replace && this.initial) {
        // Empty the DOM element.
        // This solution can be removed when https://github.com/facebook/react/issues/10713 is done.
        el.innerHTML = ''; // eslint-disable-line no-param-reassign
      }

      // If the children are regular react children.
      if (typeof children !== 'function') {
        this.portals.push(createPortal(children, el));
        return;
      }

      this.portals.push(createPortal(
        <div>{children(el.dataset.id)}</div>,
        el
      ));
    });

    return this.portals;
  }
}

export default Portal;
