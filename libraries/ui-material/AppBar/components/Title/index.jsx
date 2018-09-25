import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * @param {Function} props.title The title to display.
 * @returns {JSX}
 */
function AppBarTitle({ title }) {
  return (
    <div className={styles}>{title}</div>
  );
}

AppBarTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default AppBarTitle;
