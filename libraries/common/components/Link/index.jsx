import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ACTION_PUSH,
  ACTION_REPLACE,
} from '@virtuous/conductor/constants';
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
    href: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    replace: PropTypes.bool,
    state: PropTypes.shape(),
    tag: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    disabled: false,
    replace: false,
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

    const action = this.props.replace ? ACTION_REPLACE : ACTION_PUSH;
    this.props.navigate(action, this.props.href, this.props.state);
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { tag: Tag } = this.props;
    return (
      <Tag
        className={`${styles} ${this.props.className}`}
        onClick={this.handleOpenLink}
        role="link"
      >
        {this.props.children}
      </Tag>
    );
  }
}

export const Disconnected = Link;

export default connect(Link);
