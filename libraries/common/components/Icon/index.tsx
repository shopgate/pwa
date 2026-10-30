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
 */
const Icon = ({ content, ...props }: IconProps) => <SvgIcon markup={content} {...props} />;

export default Icon;
