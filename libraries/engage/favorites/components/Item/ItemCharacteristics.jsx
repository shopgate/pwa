import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  property: {
    fontSize: 14,
    color: 'var(--color-text-medium-emphasis)',
    fontWeight: 400,
  },
});

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ItemCharacteristics = ({ characteristics }) => {
  const { classes } = useStyles();
  if (!characteristics || characteristics.length === 0) {
    return null;
  }

  return (
    <ul>
      {characteristics.map(({ label, value }) => (
        <li key={`${label}-${value}`} className={classes.property}>
          {label}
          {': '}
          {value}
        </li>
      ))}
    </ul>
  );
};

ItemCharacteristics.propTypes = {
  characteristics: PropTypes.arrayOf(PropTypes.shape()),
};

ItemCharacteristics.defaultProps = {
  characteristics: null,
};

export default ItemCharacteristics;
