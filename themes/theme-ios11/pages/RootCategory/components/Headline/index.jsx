import React from 'react';
import Headline from 'Components/Headline';
import styles from './style';

/**
 * The CategoryHeadline component.
 * @returns {JSX}
 */
function CategoryHeadline() {
  return (
    <div className={styles}>
      <Headline text="titles.categories" />
    </div>
  );
}

export default CategoryHeadline;
