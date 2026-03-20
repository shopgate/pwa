import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withForwardedRef } from '@shopgate/engage/core';
import { withStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * Renders a glowing component that is visible when the user interacts with the element.
 */
class Glow extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    color: PropTypes.string,
    disabled: PropTypes.bool,
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
    disabled: false,
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
    if (this.props.disabled) {
      return;
    }

    this.setState({ hover: true });

    this.timeout = setTimeout(() => {
      this.setState({ hover: false });
    }, 250);
  };

  /**
   * Renders the component.
   * @returns {JSX.Element}
   */
  render() {
    const {
      children, styles: propStyles, forwardedRef, className, color, ...rest
    } = this.props;

    const classes = withStyles.getClasses(this.props);

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
        className={classNames(classes.container, className, 'ui-shared__glow')}
        onClick={this.handleTouchTap}
        style={propStyles.container}
        ref={forwardedRef}
      >
        <div className={classes.glow} style={innerInlineStyles} />
        {children}
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions,
    jsx-a11y/click-events-have-key-events */
  }
}

const StyledGlow = withStyles(Glow, {
  container: {
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: 'transparent',
    transition: 'background 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    zIndex: 0,
  },
});

export default withForwardedRef(StyledGlow);
