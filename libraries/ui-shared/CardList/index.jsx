import React, { Component, Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import List from '@shopgate/pwa-common/components/List';
import Item from './components/Item';

/**
 * The CardList component.
 */
class CardList extends Component {
  static Item = Item;

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  };

  static defaultProps = {
    children: null,
    className: '',
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { children, className } = this.props;

    if (!Children.count(children)) {
      return null;
    }

    return (
      <List className={className}>
        {Children.map(children, (child) => {
          if (!isValidElement(child)) {
            return null;
          }

          return child;
        })}
      </List>
    );
  }
}

export default CardList;
