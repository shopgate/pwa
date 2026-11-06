import SvgIcon, { type SvgIconProps } from '@shopgate/engage/icons/components/SvgIcon';

export interface IconProps extends Omit<SvgIconProps, 'markup' | 'normalize'> {
  /**
   * SVG markup that is sanitized and rendered: a complete svg element or the content of one.
   */
  content: string;
}

/**
 * The Icon component.
 *
 * Renders an inline SVG icon using sanitized SVG markup.
 *
 * Provides basic styling via `currentColor` and supports size and color
 * overrides through props while allowing external class-based overrides.
 * Colors and line widths of the markup are kept unless `keepColors` is false, which
 * normalizes the markup like the icons merchants replace.
 */
const Icon = ({ content, keepColors = true, ...props }: IconProps) => (
  <SvgIcon markup={content} keepColors={keepColors} normalize={!keepColors} {...props} />
);

export default Icon;
