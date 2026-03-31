import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { objectWithoutProps } from '../../../../helpers/data';

const useStyles = makeStyles()((_theme, { grow, shrink }) => ({
  root: {
    ...(grow !== 0 ? { flexGrow: grow } : {}),
    ...(shrink !== 1 ? { flexShrink: shrink } : {}),
  },
}));

/**
 * The grid item component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const GridItem = ({
  className,
  component,
  grow,
  shrink,
  ...rest
}) => {
  const { classes, cx } = useStyles({
    grow,
    shrink,
  });
  const composedClassName = cx(
    className,
    classes.root,
    {
      'common__grid__item--custom-flex': grow !== 0 || shrink !== 1,
    }
  );

  const props = objectWithoutProps(
    {
      ...rest,
      className: composedClassName,
    },
    ['classes']
  );

  return React.createElement(component, props);
};

GridItem.propTypes = {
  className: PropTypes.string,
  component: PropTypes.string,
  grow: PropTypes.number,
  shrink: PropTypes.number,
};

GridItem.defaultProps = {
  className: '',
  component: 'li',
  grow: 0,
  shrink: 1,
};

export default GridItem;
