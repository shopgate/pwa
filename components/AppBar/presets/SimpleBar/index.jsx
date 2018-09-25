import React from 'react';
import PropTypes from 'prop-types';
import DefaultBar from '../DefaultBar';

/**
 * @param {string} props.title The title in the bar.
 * @returns {JSX}
 */
function SimpleBar({ title }) {
  return (
    <DefaultBar title={title} right={null} />
  );
}

SimpleBar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SimpleBar;
