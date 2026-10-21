import React, {
  forwardRef, useMemo, type ElementType, type HTMLAttributes,
} from 'react';
import {
  sanitizeHtml, sanitizeInlineHtml, sanitizeRichHtml, sanitizeSvg,
} from './sanitize';

const sanitizers = {
  inline: sanitizeInlineHtml,
  html: sanitizeHtml,
  rich: sanitizeRichHtml,
  svg: sanitizeSvg,
};

export interface SafeHtmlProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** The HTML string that is sanitized and rendered. */
  html?: string | null;
  /** The element or component that renders the HTML. */
  as?: ElementType;
  /** Inline formatting (inline, default), with lists and links (html), embedded media (rich), SVG. */
  profile?: keyof typeof sanitizers;
  [prop: string]: unknown;
}

/**
 * Renders an HTML string after removing everything that is not allowed by the sanitizer.
 * @returns The element with the sanitized HTML.
 */
const SafeHtml = forwardRef<HTMLElement, SafeHtmlProps>(({
  html = null,
  as: Component = 'div',
  profile = 'inline',
  ...rest
}, ref) => {
  const sanitized = useMemo(() => (html ? sanitizers[profile](html) : ''), [html, profile]);

  // eslint-disable-next-line react/no-danger
  return <Component {...rest} ref={ref} dangerouslySetInnerHTML={{ __html: sanitized }} />;
});

export default SafeHtml;
