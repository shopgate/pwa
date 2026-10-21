import React, { useMemo } from 'react';
import htmlToText from '@shopgate/pwa-common/helpers/html/htmlToText';

export interface PlainTextProps {
  /** The text that may contain HTML entities or markup. */
  text?: string | null;
}

/**
 * Converts a string that may contain HTML entities or markup into plain text.
 * @param text The string.
 * @returns The plain text.
 */
export const usePlainText = (text?: string | null) => useMemo(() => htmlToText(text ?? ''), [text]);

/**
 * Renders a string as a text node with decoded entities and without markup.
 * @returns The text.
 */
const PlainText = ({ text = null }: PlainTextProps) => <>{usePlainText(text)}</>;

export default PlainText;
