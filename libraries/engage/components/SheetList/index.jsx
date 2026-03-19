import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/engage';
import List from '@shopgate/pwa-common/components/List';
import Item from './components/Item';

const { variables, colors } = themeConfig;
const IMAGE_SPACE = 72;

/**
 * The SheetList component.
 * Styled sheet for List component
 */
class SheetList extends Component {
  static Item = Item;

  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.shape({
      innerContainer: PropTypes.string,
      item: PropTypes.string,
      itemNotLast: PropTypes.string,
      itemSelected: PropTypes.string,
      itemWithImage: PropTypes.string,
    }),
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
    hasImages: PropTypes.bool,
    testId: PropTypes.string,
  };

  static defaultProps = {
    classes: {
      innerContainer: '',
      item: '',
      itemNotLast: '',
      itemSelected: '',
      itemWithImage: '',
    },
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
    const classes = withStyles.getClasses(this.props);

    if (!React.Children.count(children)) {
      return null;
    }

    const itemClasses = {
      [classes.item]: true,
      [classes.itemWithImage]: hasImages,
    };

    return (
      <List className={`${className} engage__sheet-list`} role="listbox">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) {
            return null;
          }
          // The key for each child.
          const key = `child-${index}`;
          // Selected state for the child.
          const { isSelected } = child.props;

          const childClasses = {
            [classes.itemSelected]: isSelected,
            [classes.itemNotLast]: !isSelected,
          };

          return (
            <List.Item
              className={classNames(itemClasses, childClasses, isSelected ? 'engage__sheet-list__selected-item' : 'engage__sheet-list__item')}
              isSelected={isSelected}
              key={key}
              tabIndex={0}
            >
              <div className={classes.innerContainer} data-test-id={testId}>
                {child}
              </div>
            </List.Item>
          );
        })}
      </List>
    );
  }
}

export default withStyles(
  SheetList,
  () => ({
    item: {
      margin: `0 ${variables.gap.big}px`,
      cursor: 'pointer',
    },
    itemNotLast: {
      '&:not(:last-child)': {
        boxShadow: `0 1px 0 0 ${colors.darkGray}`,
        marginBottom: 1,
      },
    },
    itemSelected: {
      background: 'var(--color-background-accent)',
      boxShadow: `-${variables.gap.bigger}px 0 0 var(--color-background-accent), ${variables.gap.bigger}px 0 0 var(--color-background-accent)`,
      marginTop: -1,
    },
    itemWithImage: {
      marginLeft: IMAGE_SPACE,
    },
    innerContainer: {
      minHeight: 56,
      position: 'relative',
    },
  })
);
