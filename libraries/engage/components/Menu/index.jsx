import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@shopgate/engage/styles';
import { ConnectedReactPortal } from '@shopgate/engage/components';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Position from './components/Position';
import Item from './components/Item';

/**
 * The Menu component.
 */
class Menu extends Component {
  static Item = Item;

  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.shape({
      menu: PropTypes.string,
      overlay: PropTypes.string,
    }),
    contextRef: PropTypes.shape(),
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    classes: {
      menu: '',
      overlay: '',
    },
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
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { children, isOpen, onClose } = this.props;
    const classes = withStyles.getClasses(this.props);

    return (
      <ConnectedReactPortal isOpened={isOpen}>
        <div className={classes.overlay}>
          <Backdrop isVisible level={0} opacity={0} onClick={onClose} />
          <Position offset={this.offset}>
            <div className={classes.menu}>
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

export default withStyles(
  Menu,
  () => ({
    overlay: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 10,
    },
    menu: {
      position: 'absolute',
      top: 0,
      left: 0,
      padding: `${themeConfig.variables.gap.small}px 0`,
      minWidth: 130,
      background: themeConfig.colors.light,
      borderRadius: 2,
      boxShadow: themeConfig.shadows.contextMenu,
    },
  })
);
