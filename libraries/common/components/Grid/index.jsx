import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { objectWithoutProps } from '../../helpers/data';
import GridItem from './components/Item';
import styles, { wrap } from './style';

/**
 * The grid component.
 */
class Grid extends Component {
  static Item = GridItem;

  static propTypes = {
    className: PropTypes.string,
    component: PropTypes.string,
    wrap: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    component: 'ul',
    wrap: false,
  };

  /**
   * Composes the props.
   * @returns {Object} The composed props.
   */
  getProps() {
    let className = `${this.props.className} ${styles} common__grid`;

    if (this.props.wrap) {
      className += ` ${wrap(this.props.wrap)}`;
    }

    const props = {
      ...this.props,
      className,
    };

    return objectWithoutProps(props, [
      'wrap',
      'component',
    ]);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return React.createElement(this.props.component, this.getProps());
  }
}

export default Grid;
