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
    className: PropTypes.string,
    disabled: PropTypes.bool,
    flat: PropTypes.bool,
    navigate: PropTypes.func,
    noGap: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    className: '',
    navigate: () => {},
    noGap: false,
    flat: true,
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
    const {
      children, href, navigate, ...props
    } = this.props;

    return (
      <ActionButton onClick={this.handleClick} type="secondary" {...props}>
        {children}
      </ActionButton>
    );
  }
}

export default connect(ButtonLink);

export { ButtonLink as UnwrappedButtonLink };
