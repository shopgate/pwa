import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { ConnectedReactPortal } from '@shopgate/engage/components';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import Position from './components/Position';
import Item from './components/Item';
import styles from './style';

/**
 * The Menu component.
 */
class Menu extends Component {
  static Item = Item;

  static propTypes = {
    children: PropTypes.node,
    contextRef: PropTypes.shape(),
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    children: null,
    contextRef: null,
    isOpen: false,
    onClose: () => {},
  };

  /**
   * Gets the offset of the DOM element.
   * @returns {Object}
   */
  get offset() {
    if (this.props.contextRef?.current) {
      const bounds = this.props.contextRef.current.getBoundingClientRect();
      return {
        height: bounds.height,
        width: bounds.width,
        left: bounds.left,
        right: bounds.right,
        bottom: bounds.bottom,
        top: bounds.top + bounds.height,
      };
    }

    return {
      top: 0,
      left: 0,
    };
  }

  /**
   * Handles any menu toggling interactions.
   * @param {Object} [e] Event
   */
  handleMenuToggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (this.props.contextRef?.current) {
      this.props.onClose();
    }
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { children, isOpen, onClose } = this.props;

    return (
      <ConnectedReactPortal isOpened={isOpen}>
        <div className={styles.overlay}>
          <Backdrop isVisible level={0} opacity={0} onClick={onClose} />
          <Position offset={this.offset}>
            <div className={styles.menu}>
              {Children.map(children, (child) => {
                if (!child) {
                  return null;
                }

                return (
                  React.cloneElement(child, { closeMenu: onClose })
                );
              })}
            </div>
          </Position>
        </div>
      </ConnectedReactPortal>
    );
  }
}

export default Menu;
