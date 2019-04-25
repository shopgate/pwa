import React from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import {
  NAVIGATION_PUSH,
  NAVIGATION_POP,
  NAVIGATION_REPLACE,
  NAVIGATION_RESET,
} from '../../core/router/helpers';
import connect from './connector';

/**
 * Handles
 */
class NavigationHandler extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    pop: PropTypes.func,
    push: PropTypes.func,
    replace: PropTypes.func,
    reset: PropTypes.func,
  };

  static defaultProps = {
    pop: () => { },
    push: () => { },
    replace: () => { },
    reset: () => { },
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    UIEvents.addListener(NAVIGATION_PUSH, props.push);
    UIEvents.addListener(NAVIGATION_POP, props.pop);
    UIEvents.addListener(NAVIGATION_REPLACE, props.replace);
    UIEvents.addListener(NAVIGATION_RESET, props.reset);
  }

  /**
   * Removes the event listeners.
   */
  componentWillUnmount() {
    UIEvents.removeListener(NAVIGATION_PUSH, this.props.push);
    UIEvents.removeListener(NAVIGATION_POP, this.props.pop);
    UIEvents.removeListener(NAVIGATION_REPLACE, this.props.replace);
    UIEvents.removeListener(NAVIGATION_RESET, this.props.reset);
  }

  /**
   * @returns {null}
   */
  render() {
    return this.props.children;
  }
}

export default connect(NavigationHandler);
