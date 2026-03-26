import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/engage';
import List from '@shopgate/pwa-common/components/List';
import Item from './components/Item';

const { variables, colors } = themeConfig;
const IMAGE_SPACE = 72;

const useStyles = makeStyles()({
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
});

/**
 * The SheetList component.
 * Styled sheet for List component
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const SheetList = ({
  children,
  className,
  hasImages,
  testId,
}) => {
  const { classes } = useStyles();

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
        const key = `child-${index}`;
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
};

SheetList.Item = Item;

SheetList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  hasImages: PropTypes.bool,
  testId: PropTypes.string,
};

SheetList.defaultProps = {
  children: null,
  className: null,
  hasImages: false,
  testId: null,
};

export default SheetList;
