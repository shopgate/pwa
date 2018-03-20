import React, { Component } from 'react';
import PropTypes from 'prop-types';
/**
 * Mocked View.
 * @type {MockedView}
 */
export const MockedView = class extends Component {
  static propTypes = {
    children: PropTypes.node,
  };
  static defaultProps = {
    children: null,
  };
  /**
   * Renders mocked view.
   * @return {JSX}
   */
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
};
