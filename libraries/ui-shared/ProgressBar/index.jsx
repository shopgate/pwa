import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import styles from './style';

const duration = 150;

const transitionStyles = {
  entering: {
    transform: 'scale(1, 1)',
  },
  entered: {
    transform: 'scale(1, 1)',
  },
  exited: {
    transform: 'scale(1, 0)',
  },
  exiting: {
    transform: 'scale(1, 0)',
  },
};

/**
 * A component for visualizing any kind of progress.
 * This component will show the current progress in a linear bar.
 */
class ProgressBar extends Component {
  static PROGRESS_BAR_SHOW = 'PROGRESS_BAR_SHOW';

  static PROGRESS_BAR_HIDE = 'PROGRESS_BAR_HIDE';

  /**
   * Shows the progress bar.
   * @param {string} pattern The router pattern to show the bar for.
   */
  static show = (pattern) => {
    UIEvents.emit(ProgressBar.PROGRESS_BAR_SHOW, pattern);
  }

  /**
   * Hides the progress bar.
   * @param {string} pattern The router pattern to hide the bar from.
   */
  static hide = (pattern) => {
    UIEvents.emit(ProgressBar.PROGRESS_BAR_HIDE, pattern);
  }

  static propTypes = {
    isVisible: PropTypes.bool,
  };

  static defaultProps = {
    isVisible: true,
  };

  /**
   * The constructor
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      isAnimating: props.isVisible,
      isVisible: props.isVisible,
    };
  }

  /**
   * Update the state based on props.
   * @param {Object} nextProps The next set of props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isVisible === nextProps.isVisible) {
      return;
    }

    this.setState({
      ...(nextProps.isVisible && { isAnimating: true }),
      isVisible: nextProps.isVisible,
    });
  }

  /**
   * Only update when certain state changes are made.
   * @param {Object} nextProps The next set of props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.isAnimating !== nextState.isAnimating ||
      this.state.isVisible !== nextState.isVisible
    );
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const animationClasses = [
      styles.innerElement,
    ];

    // Add the animation if we need it.
    if (this.state.isAnimating) {
      animationClasses.push(styles.animating);
    }

    return (
      <Transition
        in={this.state.isVisible}
        timeout={duration}
        onExited={() => { this.setState({ isAnimating: false }); }}
      >
        {state => (
          <div
            className={styles.wrapper}
            style={transitionStyles[state]}
          >
            <div className={animationClasses.join(' ')} />
          </div>
        )}
      </Transition>
    );
  }
}

export default ProgressBar;
