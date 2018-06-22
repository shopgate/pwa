import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BaseList from '@shopgate/pwa-common/components/List';
import BaseListItem from '@shopgate/pwa-common/components/List/components/Item';
import Item from './components/Item';
import styles from './style';

/**
 * The list component.
 */
class List extends Component {
  static Item = Item;

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    className: '',
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { className, children } = this.props;

    if (!React.Children.count(children)) {
      return null;
    }

    return (
      <BaseList className={classNames(className, styles.container)}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) {
            return null;
          }

          // The key for each child.
          const key = `child-${index}`;

          return (
            <BaseListItem
              isSelected={child.props.isSelected}
              key={key}
            >
              <div className={styles.item}>
                {child}
              </div>
            </BaseListItem>
          );
        })}
      </BaseList>
    );
  }
}

export default List;
