import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The headline component.
 * @param {string} text The component props.
 * @returns {JSX}
 */
const Headline = ({ text }) => (
  text.length ? <h3 className={`${styles} headline theme__headline`}>{text}</h3> : null
);

Headline.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Headline;
