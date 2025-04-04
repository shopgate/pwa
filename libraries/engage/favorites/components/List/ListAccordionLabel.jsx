import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';

/**
 * Favorite List Accordion Label component
 * @param {string} title The label name
 * @return {JSX.Element}
 */
const ListAccordionLabel = ({
  title,
}) => (
  <span className={styles.title}>
    {title}
  </span>
);

ListAccordionLabel.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ListAccordionLabel;
