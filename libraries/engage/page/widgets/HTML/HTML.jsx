import React from 'react';
import HtmlSanitizer from '@shopgate/pwa-common/components/HtmlSanitizer';
import { useHtmlWidget } from './hooks';

/**
 * The HtmlWidget component is used to display html code.
 * @returns {JSX.Element}
 */
const HtmlWidget = () => {
  const { html } = useHtmlWidget();

  return (
    <HtmlSanitizer settings={{ html }}>
      {html}
    </HtmlSanitizer>
  );
};

export default HtmlWidget;
