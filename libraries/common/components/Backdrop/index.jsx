import React, { Component } from 'react';
import { css } from 'glamor';
import PropTypes from 'prop-types';
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
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    color: PropTypes.string,
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
    className: {},
    color: '#000',
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
   * @returns {string}
   */
  get className() {
    return css(style, this.props.className);
  }

  /**
   * @returns {Object}
   */
  get style() {
    const { color, level, opacity } = this.props;

    return {
      opacity: (opacity / 100),
      background: color,
      zIndex: level,
    };
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { isVisible } = this.props;

    if (!isVisible) {
      return null;
    }

    return (
      <div aria-hidden style={this.style} className={this.className} onClick={this.props.onClick} />
    );
  }
}

export default Backdrop;
