import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import Transition from 'react-transition-group/Transition';
import { Backdrop } from '@shopgate/engage/components';
import { ModalStateTracker } from '@shopgate/engage/a11y/components';
import { UIEvents } from '@shopgate/pwa-core';
import Divider from './components/Divider';
import Item from './components/Item';
import Section from './components/Section';
import Title from './components/Title';
import { contentStyle, drawerStyle } from './style';
import transition from './transition';

const OPEN = 'navdrawer_open';
const CLOSE = 'navdrawer_close';

/**
 * The NavDrawer component
 */
class NavDrawer extends Component {
  static close = () => {
    UIEvents.emit(CLOSE);
  }

  static open = () => {
    UIEvents.emit(OPEN);
  }

  static EVENT_OPEN = OPEN;

  static EVENT_CLOSE = CLOSE;

  static Divider = Divider;

  static Item = Item;

  static Section = Section

  static Title = Title;

  static propTypes = {
    children: PropTypes.node.isRequired,
    'aria-hidden': PropTypes.bool,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
  }

  static defaultProps = {
    'aria-hidden': false,
    onClose: noop,
    onOpen: noop,
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.contentRef = React.createRef();
    this.a11yCloseRef = React.createRef();
    this.state = {
      open: false,
    };

    // Save a reference to the element that triggered the NavDrawer
    this.triggerElement = null;

    UIEvents.addListener(OPEN, this.open);
    UIEvents.addListener(CLOSE, this.close);
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {JSX}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.open !== nextState.open;
  }

  /**
   * The unmount lifecycle hook
   */
  componentWillUnmount() {
    UIEvents.removeListener(OPEN, this.open);
    UIEvents.removeListener(CLOSE, this.close);
  }

  onEntering = () => {
    this.props.onOpen();
  }

  onEntered = () => {
    if (this.a11yCloseRef.current) {
      this.a11yCloseRef.current.focus();
    }
  }

  onExited = () => {
    this.contentRef.current.scrollTop = 0;

    if (this.triggerElement && typeof this.triggerElement.focus === 'function') {
      // Focus the element that triggered the NavDrawer after it closes
      this.triggerElement.focus();
    }
  }

  onExiting = () => {
    this.props.onClose();
  }

  open = () => {
    // Save a reference to the element that triggered the NavDrawer
    this.triggerElement = document.activeElement;

    this.setState({
      open: true,
    });
  }

  close = () => {
    this.setState({
      open: false,
    });
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <Fragment>
        <Transition
          onEntering={this.onEntering}
          onEntered={this.onEntered}
          onExited={this.onExited}
          onExiting={this.onExiting}
          in={this.state.open}
          timeout={300}
        >
          {(state) => {
            const ariaHidden = this.props['aria-hidden'] || state === 'exited';

            return (
              <ModalStateTracker isVisible={this.state.open}>
                <section
                  className={`${drawerStyle} ui-material__nav-drawer`}
                  data-test-id="NavDrawer"
                  style={transition[state]}
                  aria-hidden={ariaHidden}
                  tabIndex="-1"
                >
                  <Item label="common.close" ref={this.a11yCloseRef} srOnly />
                  <nav className={contentStyle} ref={this.contentRef}>
                    {this.props.children}
                  </nav>
                </section>
              </ModalStateTracker>
            );
          }}
        </Transition>
        <Backdrop
          isVisible={this.state.open}
          level={4}
          onClick={this.close}
          opacity={20}
        />
      </Fragment>
    );
  }
}

export default NavDrawer;
