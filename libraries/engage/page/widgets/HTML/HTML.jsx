import React from 'react';
import { HtmlSanitizer } from '@shopgate/engage/components';
import { useHtmlWidget } from './hooks';
import styles from './style';

/**
 * The HtmlWidget component is used to display html code.
 * @returns {JSX.Element}
 */
const HtmlWidget = () => {
  const { html } = useHtmlWidget();

  return (
    <HtmlSanitizer settings={{ html }} processStyles className={styles}>
      {html}
    </HtmlSanitizer>
  );
};

export default HtmlWidget;
