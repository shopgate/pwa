import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@shopgate/pwa-common/components/List/components/Item';
import styles from './style';

// It must be Component since it's used inside Transition and we need ref there.
/* eslint-disable react/prefer-stateless-function */
/**
 * The Card List Item component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
class Item extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isSelected: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    className: null,
    isSelected: false,
  };

  /**
   * Renders a card list item.
   * @returns {JSX|null}
   */
  render() {
    if (!Children.count(this.props.children)) {
      return null;
    }

    return (
      <ListItem className={`${styles} ${this.props.className}`} isSelected={this.props.isSelected}>
        {this.props.children}
      </ListItem>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

export default Item;
