import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import Transition from 'react-transition-group/Transition';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
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
  }

  onExiting = () => {
    this.props.onClose();
  }

  open = () => {
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
              <section
                className={drawerStyle}
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
