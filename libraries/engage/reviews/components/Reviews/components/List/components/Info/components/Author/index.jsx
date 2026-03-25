import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';

/**
 * Review Author Component.
 * @param {string} author The author's name.
 * @returns {JSX|null}
 */
const Author = ({ author }) => {
  if (!author) {
    return null;
  }

  return <I18n.Text string="reviews.author" params={{ author }} />;
};

Author.propTypes = {
  author: PropTypes.string,
};

Author.defaultProps = {
  author: null,
};

export default Author;
