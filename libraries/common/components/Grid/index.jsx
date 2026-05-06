import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { objectWithoutProps } from '../../helpers/data';
import GridItem from './components/Item';

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    minWidth: '100%',
  },
  wrap: {
    flexWrap: 'wrap',
  },
  noWrap: {
    flexWrap: 'nowrap',
  },
}));

/**
 * The grid component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Grid = ({
  className,
  component,
  wrap,
  ...rest
}) => {
  const { classes, cx } = useStyles();

  const composedClassName = cx(classes.root, 'common__grid', {
    [classes.wrap]: wrap,
    [classes.noWrap]: !wrap,
  }, className);

  const props = objectWithoutProps(
    {
      ...rest,
      className: composedClassName,
    },
    ['wrap', 'component']
  );

  return React.createElement(component, props);
};

Grid.Item = GridItem;

Grid.propTypes = {
  className: PropTypes.string,
  component: PropTypes.string,
  wrap: PropTypes.bool,
};

Grid.defaultProps = {
  className: '',
  component: 'ul',
  wrap: false,
};

export default Grid;
