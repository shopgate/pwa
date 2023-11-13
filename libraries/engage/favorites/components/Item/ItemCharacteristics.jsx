import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';

const styles = {
  property: css({
    fontSize: 14,
    color: 'var(--color-text-medium-emphasis)',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
};

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ItemCharacteristics = ({ characteristics }) => {
  if (!characteristics || characteristics.length === 0) {
    return null;
  }

  return (
    <ul>
      {characteristics.map(({ label, value }) => (
        <li key={`${label}-${value}`} className={styles.property}>
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
