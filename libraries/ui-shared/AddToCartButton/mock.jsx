import React, { Component } from 'react';
import PropTypes from 'prop-types';
/**
 * Mocked AddToCartButton.
 * @type {MockedAddToCartButton}
 */
// eslint-disable-next-line react/prefer-stateless-function
export const MockedAddToCartButton = class extends Component {
  static propTypes = {
    handleAddToCart: PropTypes.func,
  };
  static defaultProps = {
    handleAddToCart: () => {},
  };
  /**
   * Renders mocked button.
   * @return {JSX}
   */
  render() {
    return (
      <button onClick={this.props.handleAddToCart} />
    );
  }
};
