import React, { forwardRef } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import type { ShadowSize } from '@shopgate/engage/styles';

export type PaperVariant = 'elevation' | 'outlined';

export interface PaperOwnProps {
  /** Element or component to render as. @default 'div' */
  component?: React.ElementType;
  /**
   * Depth of the drop shadow. A number indexes `theme.shadows` (0–24), a `ShadowSize` resolves
   * through `theme.shadowSizes`. Ignored unless `variant` is `elevation`. @default 1
   */
  elevation?: number | ShadowSize;
  /** `elevation` draws a shadow, `outlined` a border instead. @default 'elevation' */
  variant?: PaperVariant;
  /** Removes the rounded corners. @default false */
  square?: boolean;
  /**
   * Corner radius. The theme carries a dedicated value per surface — `shape.cardsBorderRadius` for
   * cards. Ignored when `square`.
   * @default theme.shape.borderRadius
   */
  borderRadius?: number | string;
  /**
   * CSS `border` shorthand, drawn only when `variant` is `outlined`.
   * @default `1px solid ${theme.components.border.light}`
   */
  border?: string;
  /**
   * A key of `theme.palette.background` (`default` | `surface` | `emphasized`), or any CSS color.
   * @default 'surface'
   */
  background?: 'default' | 'surface' | 'emphasized' | (string & NonNullable<unknown>);
  /**
   * CSS color the shadow is drawn in. Sets `--sg-palette-shadow` on this element. Ignored unless
   * `variant` is `elevation`.
   */
  shadowColor?: string;
}

export type PaperProps =
  PaperOwnProps
  & Omit<React.HTMLAttributes<HTMLElement>, keyof PaperOwnProps>
  & { [key: `data-${string}`]: string };

type StyleParams =
  Required<Pick<PaperOwnProps, 'variant' | 'elevation' | 'square' | 'background'>>
  & Pick<PaperOwnProps, 'borderRadius' | 'border' | 'shadowColor'>;

const useStyles = makeStyles<StyleParams>({ name: 'Paper' })((theme, p) => {
  const palette = theme.palette.background[p.background as keyof typeof theme.palette.background];

  return {
    root: {
      position: 'relative',
      backgroundColor: typeof palette === 'string' ? palette : p.background,
      borderRadius: p.square ? 0 : (p.borderRadius ?? theme.shape.borderRadius),
      ...p.variant === 'elevation' && {
        boxShadow: typeof p.elevation === 'number'
          ? theme.shadows[p.elevation]
          : theme.shadowSizes[p.elevation],
        ...p.shadowColor && { [theme.vars.palette.shadow]: p.shadowColor },
      },
      ...p.variant === 'outlined' && {
        border: p.border ?? `1px solid ${theme.components.border.light}`,
      },
    },
  };
});

/**
 * A surface primitive that owns elevation, variant, corner radius and background — the base the
 * themed `Card` composes. Settings-free; theme only.
 */
const Paper = forwardRef<HTMLElement, PaperProps>((props, ref) => {
  const {
    children,
    className,
    component: Component = 'div',
    elevation = 1,
    variant = 'elevation',
    square = false,
    borderRadius,
    border,
    background = 'surface',
    shadowColor,
    ...restProps
  } = props;

  const { classes, cx } = useStyles({
    variant,
    elevation,
    square,
    borderRadius,
    border,
    background,
    shadowColor,
  });

  return (
    <Component
      ref={ref}
      className={cx(classes.root, 'engage__paper', className)}
      {...restProps}
    >
      {children}
    </Component>
  );
});

Paper.displayName = 'Paper';

export default Paper;
