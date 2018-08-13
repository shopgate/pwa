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
    hasImages: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    hasImages: false,
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { children, hasImages } = this.props;

    if (!React.Children.count(children)) {
      return null;
    }

    return (
      <BaseList>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) {
            return null;
          }
          // The key for each child.
          const key = `child-${index}`;
          // Selected state for the child.
          const { isSelected } = child.props;
          // Whether or not this child is the last.
          const isLast = (index === children.length - 1);

          const classes = [styles.item];

          if (!isLast) {
            classes.push(styles.itemNotLast);
          }

          if (hasImages) {
            classes.push(styles.itemWithImage);
          }

          return (
            <BaseListItem
              className={classNames(classes)}
              isSelected={isSelected}
              key={key}
            >
              <div className={styles.innerContainer}>
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
