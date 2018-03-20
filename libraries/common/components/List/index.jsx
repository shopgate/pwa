import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListItem from './components/Item';
import styles from './style';

/**
 * The list component.
 * @param {Object} props - The component props.
 * @param {React.Children} props.children - Some content to display inside.
 */
class List extends Component {
  static Item = ListItem;

  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  /**
   * Composes the props.
   * @returns {Object} The composed props.
   */
  getProps() {
    return {
      ...this.props,
      className: `${styles} ${this.props.className}`,
    };
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return React.createElement('ul', this.getProps());
  }
}

export default List;
