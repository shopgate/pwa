import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withForwardedRef } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import styles from './style';

/**
 * Renders a glowing component that is visible when the user interacts with the element.
 */
class Glow extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    color: PropTypes.string,
    forwardedRef: PropTypes.shape(),
    styles: PropTypes.shape({
      container: PropTypes.shape(),
      glow: PropTypes.shape(),
      hover: PropTypes.shape(),
    }),
  };

  static defaultProps = {
    color: themeConfig.colors.shade8,
    className: null,
    forwardedRef: null,
    styles: {
      container: null,
      glow: null,
      hover: null,
    },
  };

  /**
   * The component constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.timeout = null;
    this.state = {
      hover: false,
    };
  }

  /**
   * Clears any previously set timeout.
   */
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleTouchTap = () => {
    this.setState({ hover: true });

    this.timeout = setTimeout(() => {
      this.setState({ hover: false });
    }, 250);
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      children, styles: propStyles, forwardedRef, className, color, ...rest
    } = this.props;

    let innerInlineStyles;
    if (this.state.hover) {
      innerInlineStyles = {
        ...propStyles.glow,
        ...propStyles.hover,
        background: color,
      };
    } else {
      innerInlineStyles = {
        ...propStyles.glow,
      };
    }
    /* eslint-disable jsx-a11y/no-static-element-interactions,
    jsx-a11y/click-events-have-key-events */
    return (
      <div
        {...rest}
        className={classNames(styles.container, className)}
        onClick={this.handleTouchTap}
        style={propStyles.container}
        ref={forwardedRef}
      >
        <div className={styles.glow} style={innerInlineStyles} />
        {children}
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions,
    jsx-a11y/click-events-have-key-events */
  }
}

export default withForwardedRef(Glow);
