import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
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

  static Divider = Divider;

  static Item = Item;

  static Section = Section

  static Title = Title;

  static propTypes = {
    children: PropTypes.node.isRequired,
    'aria-hidden': PropTypes.bool,
  }

  static defaultProps = {
    'aria-hidden': false,
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.contentRef = React.createRef();
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

  onClose = () => {
    this.contentRef.current.scrollTop = 0;
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
          onExited={this.onClose}
          in={this.state.open}
          timeout={300}
        >
          {state => (
            <section
              className={drawerStyle}
              data-test-id="NavDrawer"
              style={transition[state]}
              aria-hidden={this.props['aria-hidden']}
            >
              <nav className={contentStyle} ref={this.contentRef}>
                {this.props.children}
              </nav>
            </section>
          )}
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
