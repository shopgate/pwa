import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import classNames from 'classnames';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import Drawer from '@shopgate/pwa-common/components/Drawer';
import Header from './components/Header';
import styles from './style';

export const SHEET_EVENTS = {
  OPEN: 'Sheet.open',
  CLOSE: 'Sheet.close',
};

/**
 * Sheet component.
 */
class Sheet extends Component {
  static Header = Header;

  /**
   * The component prop types.
   * @type {Object}
   */
  static propTypes = {
    animation: PropTypes.shape({
      in: PropTypes.string,
      out: PropTypes.string,
    }),
    backdrop: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    duration: PropTypes.number,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onDidOpen: PropTypes.func,
    onOpen: PropTypes.func,
    title: Header.propTypes.title,
  };

  /**
   * The component default props.
   * @type {Object}
   */
  static defaultProps = {
    animation: {},
    backdrop: true,
    children: null,
    className: null,
    contentClassName: null,
    duration: 300,
    isOpen: false,
    onClose: () => { },
    onDidOpen: () => { },
    onOpen: () => { },
    title: '',
  };

  /**
   * The constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.content = React.createRef();

    this.state = {
      isOpen: props.isOpen,
      scrolled: false,
    };
  }

  /**
   * Change isOpen state for new incoming props.
   * @param {Object} nextProps The next component props.
   */
  UNSAFE_componentWillReceiveProps({ isOpen }) {
    if (this.state.isOpen !== isOpen) {
      this.setState({ isOpen });
    }
  }

  /**
   * Close the Sheet.
   */
  handleScroll = throttle(() => {
    const scrolled = this.content.current.scrollTop !== 0;

    if (this.state.scrolled !== scrolled) {
      this.setState({ scrolled });
    }
  }, 10);

  /**
   * Getter for the animation props of the Sheet.
   * @returns {Object}
   */
  get animationProps() {
    return {
      duration: this.props.duration,
      ...styles.drawerAnimation,
      ...this.props.animation,
    };
  }

  /**
   * Close the Sheet.
   */
  handleClose = () => {
    this.props.onClose();

    this.setState({
      isOpen: false,
      scrolled: false,
    });
  };

  /** The Sheet is opened */
  handleDidOpen = () => {
    UIEvents.emit(SHEET_EVENTS.OPEN);
    this.props.onDidOpen();
  };

  /** The Sheet is closed */
  handleDidClose = () => {
    UIEvents.emit(SHEET_EVENTS.CLOSE);
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const children = React.Children.map(this.props.children, child => (
      React.cloneElement(
        child,
        // Only add onClose prop to other components
        typeof child.type === 'function' && this.props.onClose !== null ? (
          { onClose: this.props.onClose }
        ) : {}
      )
    ));

    const drawerClassNames = classNames(
      styles.container,
      { [this.props.className]: this.props.className }
    );

    const contentClassNames = classNames(
      styles.content,
      { [this.props.contentClassName]: this.props.contentClassName },
      { [styles.shadow]: !this.props.backdrop }
    );

    return (
      <section>
        <Drawer
          className={drawerClassNames}
          isOpen={this.state.isOpen}
          onDidOpen={this.handleDidOpen}
          onDidClose={this.handleDidClose}
          onOpen={this.props.onOpen}
          onClose={this.handleClose}
          animation={this.animationProps}
        >
          {this.props.title &&
            <Sheet.Header
              onToggleClose={this.handleClose}
              shadow={this.state.scrolled}
              title={this.props.title}
            />
          }
          <div
            ref={this.content}
            onScroll={this.handleScroll}
            className={contentClassNames}
          >
            {children}
          </div>
        </Drawer>
        {this.props.backdrop &&
          <Backdrop
            isVisible={this.state.isOpen}
            level={4}
            onClick={this.handleClose}
            opacity={20}
          />
        }
      </section>
    );
  }
}

export default Sheet;
