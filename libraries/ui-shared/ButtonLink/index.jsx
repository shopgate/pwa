import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';
import connect from './connector';

/**
 * Simple wrapper around ActionButton so it's easy to render buttons which behave as links.
 */
class ButtonLink extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    href: PropTypes.string.isRequired,
    navigate: PropTypes.func,
    noGap: PropTypes.bool,
  };

  static defaultProps = {
    navigate: () => {},
    noGap: false,
  };

  /**
   * Opens the given url on click.
   * @returns {undefined}
   */
  handleClick = () => {
    this.props.navigate(this.props.href);
  };

  /**
   * Renders an ActionButton and handles link handling.
   * @returns {XML}
   */
  render() {
    return (
      <ActionButton onClick={this.handleClick} type="secondary" noGap={this.props.noGap}>
        {this.props.children}
      </ActionButton>
    );
  }
}

export default connect(ButtonLink);
