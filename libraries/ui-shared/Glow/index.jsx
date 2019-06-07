import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
    styles: PropTypes.shape({
      container: PropTypes.shape(),
      glow: PropTypes.shape(),
    }),
  };

  static defaultProps = {
    color: themeConfig.colors.shade8,
    className: null,
    styles: {
      container: null,
      glow: null,
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
    const innerInlineStyles = {
      ...this.props.styles.glow,
    };

    if (this.state.hover) {
      innerInlineStyles.background = this.props.color;
    }
    /* eslint-disable jsx-a11y/no-static-element-interactions,
    jsx-a11y/click-events-have-key-events */
    return (
      <div
        className={classNames(styles.container, this.props.className)}
        onClick={this.handleTouchTap}
        style={this.props.styles.container}
      >
        <div className={styles.glow} style={innerInlineStyles} />
        {this.props.children}
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions,
    jsx-a11y/click-events-have-key-events */
  }
}

export default Glow;
