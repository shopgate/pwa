import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The Filter List Item Label component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Label = ({ label }) => (
  <div className={styles}>
    {label}
  </div>
);

Label.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Label;
