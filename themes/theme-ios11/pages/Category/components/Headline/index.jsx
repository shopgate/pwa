import React from 'react';
import PropTypes from 'prop-types';
import Headline from 'Components/Headline';
import connect from './connector';
import styles from './style';

/**
 * The CategoryHeadline component.
 * @returns {JSX}
 */
function CategoryHeadline({ title }) {
  return (
    <div className={styles}>
      <Headline text={title} />
    </div>
  );
}

CategoryHeadline.propTypes = {
  title: PropTypes.string,
};

CategoryHeadline.defaultProps = {
  title: '',
};

export default connect(CategoryHeadline);
