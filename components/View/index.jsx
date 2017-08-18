import React, { Component, PropTypes } from 'react';
import { onlyUpdateForKeys } from 'recompose';
import styles from './style';

/**
 * The main view component.
 */
class View extends Component {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.shape(),
  };

  static defaultProps = {
    children: null,
    style: null,
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <div className={styles} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

export default View;
