import { useMemo, type CSSProperties } from 'react';
import camelCase from 'lodash/camelCase';
import { makeStyles } from '@shopgate/engage/styles';
import { parseIconSvg } from '../../helpers/parseIconSvg';
import type { ParsedIcon } from '../../types';

const DEFAULT_VIEW_BOX = '0 0 24 24';

const useStyles = makeStyles()(theme => ({
  root: {
    fill: 'currentColor',
    width: '1em',
    height: '1em',
  },
  stroke: {
    strokeWidth: `calc(var(${theme.vars.components.icon.strokeWidth}, var(--sgi-stroke-base)) * var(--sgi-stroke-scale))`,
  },
}));

export interface SvgIconProps {
  /**
   * Icon markup: a complete svg element, or the content of one.
   */
  markup: string;
  /**
   * Additional class name(s) applied to the root element.
   */
  className?: string;
  /**
   * Overrides the icon color (maps to CSS `color`, which the icon follows via `currentColor`).
   */
  color?: string;
  /**
   * Controls the icon size via `font-size`.
   * @default 'inherit'
   */
  size?: string | number;
  /**
   * The viewBox for markup without an own svg element. An own viewBox of the markup wins.
   * @default '0 0 24 24'
   */
  viewBox?: string;
  /**
   * Keeps the colors of the markup instead of replacing them with the text color.
   */
  keepColors?: boolean;
  /**
   * Whether to normalize the markup. Core icons are stored normalized.
   */
  normalize?: boolean;
}

/**
 * Formats a number for a CSS value without float noise.
 * @param value The number.
 * @returns The formatted number.
 */
const formatNumber = (value: number) => String(Math.round(value * 10000) / 10000);

/**
 * Derives the root attributes and styles of the svg element from a parsed icon.
 * @param icon The parsed icon.
 * @param viewBox The viewBox prop.
 * @returns The viewBox, the attributes and the styles of the svg element.
 */
const getSvgProps = (icon: ParsedIcon, viewBox?: string) => {
  const resolvedViewBox = icon.viewBox ?? viewBox ?? DEFAULT_VIEW_BOX;
  const { fill, ...presentation } = icon.attributes;

  const attributes = Object.entries(presentation).reduce<Record<string, string>>(
    (result, [name, value]) => ({
      ...result,
      [camelCase(name)]: value,
    }),
    {}
  );

  const style: Record<string, string> = {};

  if (fill && fill.toLowerCase() !== 'currentcolor') {
    style.fill = fill;
  }

  if (icon.strokeWidth !== undefined) {
    const viewBoxWidth = parseFloat(resolvedViewBox.split(/[\s,]+/)[2]);
    const scale = viewBoxWidth > 0 ? viewBoxWidth / 24 : 1;

    style['--sgi-stroke-base'] = formatNumber(icon.strokeWidth / scale);
    style['--sgi-stroke-scale'] = formatNumber(scale);
  }

  return {
    viewBox: resolvedViewBox,
    attributes,
    style,
    hasStroke: icon.strokeWidth !== undefined,
  };
};

/**
 * Renders icon markup as an inline svg. Fill icons follow the text color via `fill`, line icons
 * keep their `fill: none` and get the stroke width token, scaled to their viewBox.
 * @returns The svg element.
 */
const SvgIcon = ({
  markup,
  className,
  color,
  size = 'inherit',
  viewBox,
  keepColors = false,
  normalize = true,
}: SvgIconProps) => {
  const { cx, classes } = useStyles();
  const icon = useMemo(
    () => parseIconSvg(markup, {
      keepColors,
      normalize,
    }),
    [markup, keepColors, normalize]
  );
  const svg = useMemo(() => getSvgProps(icon, viewBox), [icon, viewBox]);

  const style: CSSProperties = {
    ...svg.style,
    fontSize: size,
    ...(color ? { color } : {}),
  };

  return (
    <svg
      {...svg.attributes}
      className={cx(classes.root, svg.hasStroke && classes.stroke, 'common__icon', className)}
      viewBox={svg.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={style}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: icon.content }}
    />
  );
};

export default SvgIcon;
