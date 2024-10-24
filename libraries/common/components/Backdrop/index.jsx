import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-inline-transition-group';
import { toggleBodyScroll } from '@shopgate/engage/styles/helpers';
import style from './style';

/**
 * Backdrop component.
 */
class Backdrop extends Component {
  /**
   * The component prop types.
   * @type {Object}
   */
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    duration: PropTypes.number,
    isVisible: PropTypes.bool,
    level: PropTypes.number,
    lockBodyScroll: PropTypes.bool,
    onClick: PropTypes.func,
    opacity: PropTypes.number,
  };

  /**
   * The component default props.
   * @type {Object}
   */
  static defaultProps = {
    className: '',
    color: '#000',
    duration: 200,
    isVisible: false,
    level: 2,
    onClick: () => {},
    opacity: 50,
    lockBodyScroll: true,
  };

  /**
   * @param {Object} props The component props
   */
  constructor(props) {
    super(props);

    this.bodyScrollRef =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  /**
   * Sets the initial state for the body scroll lock
   */
  componentDidMount() {
    const { isVisible, lockBodyScroll } = this.props;

    if (lockBodyScroll) {
      toggleBodyScroll(isVisible, this.bodyScrollRef);
    }
  }

  /**
   * Toggles the body scroll lock when the visibility state changes
   * @param {Object} nextProps The next component props
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isVisible, lockBodyScroll } = nextProps;

    if (isVisible === this.props.isVisible) {
      return;
    }

    if (lockBodyScroll) {
      toggleBodyScroll(isVisible, this.bodyScrollRef);
    }
  }

  /**
   * Only update when the `isVisible` prop changes.
   * @param {Object} nextProps The next set of component props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (this.props.isVisible !== nextProps.isVisible);
  }

  /**
   * Removes the body scroll lock when the component unmounts
   */
  componentWillUnmount() {
    const { lockBodyScroll } = this.props;

    if (lockBodyScroll) {
      toggleBodyScroll(false, this.bodyScrollRef);
    }
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const opacity = (this.props.opacity / 100);
    const transition = {
      base: {
        background: this.props.color,
        opacity: 0,
        transition: `opacity ${this.props.duration}ms ease-out`,
        zIndex: this.props.level,
      },
      appear: {
        opacity,
      },
      enter: {
        opacity,
      },
      leave: {
        opacity: 0,
      },
    };

    const className = `${style} ${this.props.className} common__backdrop`;

    return (
      <Transition childrenStyles={transition}>
        {this.props.isVisible ?
          <div data-test-id="Backdrop" aria-hidden className={className} onClick={this.props.onClick} /> : null
        }
      </Transition>
    );
  }
}

export default Backdrop;
