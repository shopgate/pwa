import React, { useMemo } from 'react';
import WidgetHeadline from '../../components/WidgetHeadline';
import { useWidget } from '../../hooks';

/**
 * The HeadlineWidget is used to display a headline text.
 * @returns {JSX.Element}
 */
const Headline = () => {
  const { config, layout } = useWidget();

  const { headline } = config;

  const widgetMargins = useMemo(() => ({
    marginRight: layout.marginRight || 0,
    marginLeft: layout.marginLeft || 0,
  }), [layout.marginLeft, layout.marginRight]);

  if (!headline) return null;

  return (
    <WidgetHeadline headline={headline} widgetMargins={widgetMargins} />
  );
};

export default Headline;
