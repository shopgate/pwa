import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import classNames from 'classnames';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import MoreVertIcon from '../icons/MoreVertIcon';
import Position from './components/Position';
import Item from './components/Item';
import styles from './style';

/**
 * The ContextMenu component.
 */
class ContextMenu extends Component {
  static Item = Item;

  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.shape(),
  };

  static defaultProps = {
    children: null,
    classes: { container: '', button: '' },
  };

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
   * @param {Object} [e] Event
   */
  handleMenuToggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (this.elementRef) {
      this.setState(({ active }) => ({
        active: !active,
      }));
    }
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { children, classes } = this.props;
    const { active } = this.state;

    return (
      <div
        data-test-id="contextMenu"
        ref={(ref) => { this.elementRef = ref; }}
        className={classNames(styles.container, classes.container)}
        aria-hidden
      >
        <button
          className={classNames(styles.button, classes.button)}
          onClick={this.handleMenuToggle}
          type="button"
          aria-hidden
        >
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
