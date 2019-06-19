import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { List } from '../';
import Item from './components/Item';
import styles from './style';

/**
 * The SheetList component.
 * Styled sheet for List component
 */
class SheetList extends Component {
  static Item = Item;

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
    hasImages: PropTypes.bool,
    testId: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    className: null,
    hasImages: false,
    testId: null,
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      children, className, hasImages, testId,
    } = this.props;

    if (!React.Children.count(children)) {
      return null;
    }

    return (
      <List className={className}>
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

          if (isSelected) {
            classes.push(styles.itemSelected);
          } else if (!isLast) {
            classes.push(styles.itemNotLast);
          }

          if (hasImages) {
            classes.push(styles.itemWithImage);
          }

          return (
            <List.Item
              className={classNames(classes)}
              isSelected={isSelected}
              key={key}
            >
              <div className={styles.innerContainer} data-test-id={testId}>
                {child}
              </div>
            </List.Item>
          );
        })}
      </List>
    );
  }
}

export default SheetList;
