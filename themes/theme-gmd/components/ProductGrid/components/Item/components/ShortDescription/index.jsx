import React from 'react';
import PropTypes from 'prop-types';
import { wrapper } from './style';

/**
 * The ShortDescription component.
 * @param {Object} props - The component props.
 * @param {string} props.shortDescription - The short description HTML string.
 * @returns {JSX.Element|null} The rendered component or null.
 */
const ShortDescription = ({ shortDescription }) => {
  if (!shortDescription) {
    return null;
  }

  return (
    <div className={wrapper} dangerouslySetInnerHTML={{ __html: shortDescription }} />
  );
};

ShortDescription.propTypes = {
  shortDescription: PropTypes.string,
};

ShortDescription.defaultProps = {
  shortDescription: null,
};

export default ShortDescription;
