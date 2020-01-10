import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { TweenMax } from 'gsap';

/**
 * Handles a transition of an object.
 * This component only can have one child element at a time!
 */
class Transition extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    duration: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    easing: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    from: PropTypes.shape(),
    onComplete: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    origin: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    set: PropTypes.shape(), // eslint-disable-line react/no-unused-prop-types
    to: PropTypes.shape(),
  };

  static defaultProps = {
    easing: 'Power1.easeOut',
    origin: '0 0 0',
    duration: 150,
    from: null,
    onComplete: () => { },
    set: null,
    to: null,
  };

  /**
   * Runs the transition animation initially.
   */
  componentDidMount() {
    this.animate();
  }

  /**
   * Returns the first child of children.
   * @returns {React.Element}
   */
  getFirstChild() {
    return React.Children.map(this.props.children, (element, idx) => (
      React.cloneElement(element, { ref: idx })
    ))[0];
  }

  /**
   * Checks if transition related props (from/to) have updated and runs the animation.
   * @param {Object} nextProps - The received props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    if (
      !isEqual(this.props.from, nextProps.from) ||
      !isEqual(this.props.to, nextProps.to)
    ) {
      this.animate(nextProps);
    }
  }

  /**
   * Sets the transition state and runs the transition animation.
   * @param {Object} props - The props object the animation should be based upon.
   */
  animate(props = this.props) {
    // eslint-disable-next-line react/no-find-dom-node, react/no-string-refs
    const element = findDOMNode(this.refs[0]);
    const duration = (props.duration / 1000);

    const transitionSettings = {
      ease: props.easing,
      transformOrigin: props.origin,
      onComplete: props.onComplete,
      force3D: true,
      immediateRender: true,
    };

    if (props.set) {
      // Sets properties to an absolute state.
      TweenMax.set(element, props.set);
    }

    if (this.tween) {
      // Remove previously set tween.
      this.tween.kill();
    }

    if (props.from && props.to) {
      // Starts a {from} -> {to} transition.
      this.tween = TweenMax.fromTo(element, duration, props.from, {
        ...props.to,
        ...transitionSettings,
      });
    } else if (props.from) {
      // Starts a {from} only transition.
      this.tween = TweenMax.from(element, duration, {
        ...props.from,
        ...transitionSettings,
      });
    } else if (props.to) {
      // Starts a {to} only transition.
      this.tween = TweenMax.to(element, duration, {
        ...props.to,
        ...transitionSettings,
      });
    }
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return React.Children.only(this.getFirstChild());
  }
}

export default Transition;
