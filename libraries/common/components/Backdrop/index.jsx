import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-inline-transition-group';
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
  };

  /**
   * Only update when the `isVisible` prop changes.
   * @param {Object} nextProps The next set of component props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (this.props.isVisible !== nextProps.isVisible);
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

    const className = `${style} ${this.props.className}`;

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
