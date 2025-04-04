import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The headline component.
 * @param {Object} props The component props.
 * @param {string} props.text The text for the headline
 * @returns {JSX}
 */
const Headline = ({ text }) => (
  text.length ? <h3 className={`${styles} headline theme__headline`}>{text}</h3> : null
);

Headline.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Headline;
