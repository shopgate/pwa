/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import MoreVertIcon from 'Components/icons/MoreVertIcon';
import Position from './components/Position';
import Item from './components/Item';
import styles from './style';

/**
 * The ContextMenu component.
 */
class ContextMenu extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  static Item = Item;

  /**
   * The Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.elementRef = null;
    this.state = {
      active: false,
    };
  }

  /**
   * Gets the offset of the DOM element.
   * @returns {Object}
   */
  get offset() {
    if (this.elementRef) {
      return this.elementRef.getBoundingClientRect();
    }

    return {
      top: 0,
      left: 0,
    };
  }

  /**
   * Handles any menu toggling interactions.
   */
  handleMenuToggle = () => {
    if (this.elementRef) {
      this.setState({
        active: !this.state.active,
      });
    }
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { children } = this.props;
    const { active } = this.state;

    return (
      <div ref={(ref) => { this.elementRef = ref; }} className={styles.container}>
        <button className={styles.button} onClick={this.handleMenuToggle}>
          <MoreVertIcon />
        </button>
        <Portal isOpened={active}>
          <div className={styles.overlay}>
            <Backdrop isVisible level={0} opacity={0} onClick={this.handleMenuToggle} />
            <Position offset={this.offset}>
              <div className={styles.menu}>
                {Children.map(children, child => (
                  React.cloneElement(child, { closeMenu: this.handleMenuToggle })
                ))}
              </div>
            </Position>
          </div>
        </Portal>
      </div>
    );
  }
}

export default ContextMenu;
