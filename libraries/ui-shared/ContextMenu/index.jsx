import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { ReduxConnectedReactPortal } from '@shopgate/engage/components';
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
    disabled: PropTypes.bool,
    isOpened: PropTypes.bool,
    onStateChange: PropTypes.func,
    scroll: PropTypes.bool,
    showToggle: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    classes: {
      container: '',
      button: '',
    },
    disabled: false,
    showToggle: true,
    isOpened: null,
    onStateChange: null,
    scroll: null,
  };

  /**
   * The Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.elementRef = null;
    this.state = {
      active: props.isOpened,
    };
  }

  /** @inheritDoc */
  UNSAFE_componentWillReceiveProps({ isOpened }) {
    if (typeof isOpened === 'boolean' && this.state.active !== isOpened) {
      this.setState({ active: isOpened });
    }
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
      this.setState(({ active }) => {
        const state = { active: !active };

        if (this.props.onStateChange) {
          this.props.onStateChange(state);
        }

        return state;
      });
    }
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      children, classes, disabled, showToggle, scroll,
    } = this.props;
    const { active } = this.state;

    const useScroll = typeof scroll === 'boolean' && !!scroll;

    return (
      <div
        data-test-id="contextMenu"
        ref={(ref) => { this.elementRef = ref; }}
        className={classNames(styles.container, classes.container, 'ui-shared__context-menu')}
        aria-hidden
      >
        {showToggle && (
          <button
            className={classNames(styles.button, classes.button, {
              [styles.disabled]: disabled,
            })}
            onClick={this.handleMenuToggle}
            disabled={disabled}
            type="button"
            aria-hidden
          >
            <MoreVertIcon />
          </button>
        )}
        <ReduxConnectedReactPortal isOpened={active}>
          <div className={styles.overlay}>
            <Backdrop isVisible level={0} opacity={0} onClick={this.handleMenuToggle} />
            <Position offset={this.offset}>
              <div className={classNames(styles.menu, { [styles.scrollable]: useScroll })}>
                {Children.map(children, (child) => {
                  if (!child) {
                    return null;
                  }

                  return (
                    React.cloneElement(child, { closeMenu: this.handleMenuToggle })
                  );
                })}
              </div>
            </Position>
          </div>
        </ReduxConnectedReactPortal>
      </div>
    );
  }
}

export default ContextMenu;
