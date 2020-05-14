import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { wrapper } from './SupplementalContent.styles';
import connect from './SupplementalContent.connector';

/**
 * The SupplementalContent component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const SupplementalContent = ({ text, className }) => {
  if (!text) {
    return null;
  }

  /* eslint-disable react/no-danger */
  return (
    <div
      className={classNames(wrapper, className)}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
  /* eslint-enable react/no-danger */
};

SupplementalContent.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
};

SupplementalContent.defaultProps = {
  text: null,
  className: null,
};

export default connect(SupplementalContent);
