import React from 'react';
import WidgetHeadline from '../../components/WidgetHeadline';
import { useWidget } from '../../hooks';

/**
 * The HeadlineWidget is used to display a headline text.
 * @returns {JSX.Element}
 */
const Headline = () => {
  const { config } = useWidget();

  const { headline } = config;

  if (!headline) return null;

  return (
    <WidgetHeadline headline={headline} />
  );
};

export default Headline;
