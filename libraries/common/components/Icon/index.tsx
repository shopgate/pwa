import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    fill: 'currentColor',
    width: '1em',
    height: '1em',
  },
});

export interface IconProps {
  /**
   * Raw SVG markup string that will be injected into the <svg>.
   */
  content: string;
  /**
   * Additional class name(s) applied to the root element.
   */
  className?: string;
  /**
   * Overrides the icon color (maps to CSS `fill`).
   */
  color?: string;
  /**
   * Controls the icon size via `font-size`.
   * Accepts any valid CSS size value.
   * @default 'inherit'
   */
  size?: string | number;
  /**
   * The SVG viewBox attribute.
   * @default '0 0 24 24'
   */
  viewBox?: string;
}

/**
 * The Icon component.
 *
 * Renders an inline SVG icon using injected SVG markup.
 *
 * Provides basic styling via `currentColor` and supports size and color
 * overrides through props while allowing external class-based overrides.
 */
const Icon = ({
  content,
  className,
  color,
  viewBox = '0 0 24 24',
  size = 'inherit',
}: IconProps) => {
  const { cx, classes } = useStyles();

  return (
    <svg
      className={cx(classes.root, 'common__icon', className)}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: content }}
      style={{
        fontSize: size,
        fill: color,
      }}
    />
  );
};

export default Icon;
