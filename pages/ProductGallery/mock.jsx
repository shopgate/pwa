import React from 'react';
import PropTypes from 'prop-types';

export const MockedComponent = class extends React.Component {
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
