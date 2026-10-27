import React, {
  forwardRef, useMemo, type ComponentPropsWithRef, type ElementType, type HTMLAttributes,
  type ReactElement, type Ref,
} from 'react';
import {
  sanitizeHtml, sanitizeInlineHtml, sanitizeRichHtml, sanitizeSvg,
} from './sanitize';

const sanitizers = {
  inline: sanitizeInlineHtml,
  html: sanitizeHtml,
  rich: sanitizeRichHtml,
  svg: sanitizeSvg,
  trusted: (html: string) => html,
};

/** Own props of SafeHtml, merged with the props of the element or component passed as `as`. */
type SafeHtmlOwnProps<C extends ElementType> = {
  /** The HTML string that is sanitized and rendered. */
  html?: string | null;
  /** The element or component that renders the HTML. */
  as?: C;
  /** Inline formatting (inline, default), all markup without scripts (html), plus iframes (rich),
   * SVG. trusted renders unchanged, only for content that runs its own scripts (CMS HTML widget). */
  profile?: keyof typeof sanitizers;
};

/** Props of SafeHtml including the props of the rendered element or component. */
export type SafeHtmlProps<C extends ElementType = 'div'> = SafeHtmlOwnProps<C>
  & Omit<
    ElementType extends C ? HTMLAttributes<HTMLElement> : ComponentPropsWithRef<C>,
    keyof SafeHtmlOwnProps<C> | 'children' | 'dangerouslySetInnerHTML'
  >;

/**
 * Renders an HTML string after removing everything that is not allowed by the sanitizer.
 * @returns The element with the sanitized HTML.
 */
function SafeHtml<C extends ElementType = 'div'>(
  {
    html = null, as, profile = 'inline', ...rest
  }: SafeHtmlProps<C>,
  ref: Ref<Element>
) {
  const Component: ElementType = as ?? 'div';
  const sanitized = useMemo(() => (html == null ? '' : sanitizers[profile](html)), [html, profile]);

  // eslint-disable-next-line react/no-danger
  return <Component {...rest} ref={ref} dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

export default forwardRef(SafeHtml) as <C extends ElementType = 'div'>(
  props: SafeHtmlProps<C> & { ref?: ComponentPropsWithRef<C>['ref'] }
) => ReactElement | null;
