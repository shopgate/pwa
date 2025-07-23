import React from 'react';
import { useHeadlineWidget } from './hooks';

/**
 * The HeadlineWidget is used to display a headline text.
 * @returns {JSX.Element}
 */
const Headline = () => {
  const { headline, styles } = useHeadlineWidget();

  if (!headline) return null;

  return (
    <h2 style={styles}>{headline}</h2>
  );
};

export default Headline;
