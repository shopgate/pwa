import React from 'react';
import { HtmlSanitizer } from '@shopgate/engage/components';
import { useRichTextWidget } from './hooks';

/**
 * @returns {JSX.Element}
 */
const RichText = () => {
  const { richText } = useRichTextWidget();

  if (!richText) return null;

  return (
    <HtmlSanitizer>
      {richText}
    </HtmlSanitizer>
  );
};
export default RichText;
