import React, { Component } from 'react';
import PropTypes from 'prop-types';
/**
 * Mocked AddToCartButton.
 * @type {MockedAddToCartButton}
 * @deprecated
 */
// eslint-disable-next-line react/prefer-stateless-function
export const MockedAddToCartButton = class extends Component {
  static propTypes = {
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: () => {},
  };

  /**
   * Renders mocked button.
   * @return {JSX}
   */
  render() {
    return (
      <button onClick={this.props.onClick} />
    );
  }
};
