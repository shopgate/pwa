import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from '../../style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Content = ({ content }) => {
  if (!content) {
    return null;
  }

  return (
    <div className={styles.body} id="basicDialogDesc">
      {content}
    </div>
  );
};

Content.propTypes = {
  content: PropTypes.node,
};

Content.defaultProps = {
  content: null,
};

export default memo(Content);
