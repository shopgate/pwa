import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import styles from './style';

/**
 * Link component.
 * @param {Object} props Props for the component.
 * @returns {JSX}
 */
class Link extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    historyPush: PropTypes.func.isRequired,
    historyReplace: PropTypes.func.isRequired,
    href: PropTypes.string.isRequired,
    'aria-label': PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    replace: PropTypes.bool,
    role: PropTypes.string,
    state: PropTypes.shape(),
    tag: PropTypes.string,
  };

  static defaultProps = {
    'aria-label': null,
    className: '',
    disabled: false,
    replace: false,
    role: 'link',
    tag: 'div',
    state: {},
  };

  /**
   * Opens the link.
   */
  handleOpenLink = () => {
    if (this.props.disabled) {
      return;
    }

    const params = {
      pathname: this.props.href,
      state: this.props.state || {},
    };

    if (this.props.replace) {
      this.props.historyReplace(params);
    } else {
      this.props.historyPush(params);
    }
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      tag: Tag, className, href, children, role, 'aria-label': ariaLabel,
    } = this.props;
    return (
      <Tag
        className={`${styles} ${className}`}
        onClick={this.handleOpenLink}
        role={role}
        data-test-id={`link: ${href}`}
        aria-label={ariaLabel}
      >
        {children}
      </Tag>
    );
  }
}

export const Disconnected = Link;

export default connect(Link);
