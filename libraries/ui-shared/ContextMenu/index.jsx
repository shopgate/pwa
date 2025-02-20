import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { ConnectedReactPortal } from '@shopgate/engage/components';
import classNames from 'classnames';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import { FocusTrap } from 'focus-trap-react';
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

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * The Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.elementRef = null;
    this.menuRef = null;
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
   * update the focus of the context menu popup
   * @param {Object} prevProps previous props
   * @param {Object} prevState previous state
   */
  componentDidUpdate(prevProps, prevState) {
    // Check if active changed from false to true
    if (!prevState.active && this.state.active && this.menuRef) {
      this.menuRef.focus();
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
      this.setState(
        ({ active }) => {
          const newState = { active: !active };
          if (this.props.onStateChange) {
            this.props.onStateChange(newState);
          }
          return newState;
        }
      );
    }
  };

  /**
   * Renders the component.
   * @returns {JSX.Element}
   */
  render() {
    const {
      children, classes, disabled, showToggle, scroll,
    } = this.props;
    const { active } = this.state;
    const { __ } = this.context.i18n();

    const useScroll = typeof scroll === 'boolean' && !!scroll;

    return (
      <div
        data-test-id="contextMenu"
        ref={(ref) => { this.elementRef = ref; }}
        className={classNames(styles.container, classes.container, 'ui-shared__context-menu')}
      >
        {showToggle && (
          <button
            className={classNames(styles.button, classes.button, {
              [styles.disabled]: disabled,
            })}
            onClick={this.handleMenuToggle}
            disabled={disabled}
            type="button"
            aria-label={__('navigation.open_menu')}
            aria-haspopup="true"
            aria-expanded={active}
            aria-controls="contextMenuDialog"
          >
            <MoreVertIcon aria-hidden />
          </button>
        )}
        <ConnectedReactPortal isOpened={active}>
          <FocusTrap active={active}>
            <div className={styles.overlay}>
              <Backdrop isVisible level={0} opacity={0} onClick={this.handleMenuToggle} />
              <Position offset={this.offset}>
                <div
                  className={classNames(styles.menu, { [styles.scrollable]: useScroll })}
                  ref={(node) => { this.menuRef = node; }}
                  tabIndex="-1"
                  aria-modal="true"
                  role="dialog"
                >

                  {Children.map(children, (child) => {
                    if (!child) {
                      return null;
                    }

                    return (
                      React.cloneElement(child, { closeMenu: this.handleMenuToggle })
                    );
                  })}
                  <button
                    onClick={this.handleMenuToggle}
                    className="sr-only"
                    aria-label={__('common.close')}
                    type="button"
                  >
                    {__('common.close')}
                  </button>
                </div>
              </Position>
            </div>
          </FocusTrap>
        </ConnectedReactPortal>
      </div>
    );
  }
}

export default ContextMenu;
