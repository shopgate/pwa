import React, { memo } from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @param {number} props.count  Number of total items on the wishlist.
 * @returns {JSX.Element}
 */
const FavoritesButtonBadge = ({ count }) => {
  const maxNumber = 999;
  if (count === 0) {
    return null;
  }
  const number = (count > maxNumber) ? `${maxNumber}+` : count;

  return <span className={styles}>{number}</span>;
};

FavoritesButtonBadge.propTypes = {
  count: PropTypes.number,
};

FavoritesButtonBadge.defaultProps = {
  count: 0,
};

export default connect(memo(FavoritesButtonBadge));
