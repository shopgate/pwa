import React, { Component, Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import List from '@shopgate/pwa-common/components/List';
import Item from './components/Item';

/**
 * The main card list component.
 */
class CardList extends Component {
  static Item = Item;

  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { children } = this.props;

    if (!Children.count(children)) {
      return null;
    }

    return (
      <List>
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
