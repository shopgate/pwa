import React, { forwardRef } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import type { PaletteColorsWithMain, ShadowSize, Theme } from '@shopgate/engage/styles';
import CircularProgress from '../CircularProgress';
import ButtonBase from '../ButtonBase';
import type { ButtonBaseOwnProps, ButtonBaseProps } from '../ButtonBase';

/**
 * Renders the button. Exported through `IconButtonComponent`, which carries the public docs.
 * @param props The component props.
 * @param ref Forwarded ref.
 * @returns The rendered button.
 */
function IconButton<C extends React.ElementType = 'button'>(
  props: IconButtonProps<C>,
  ref: React.Ref<Element>
) {
  const {
    variant = 'plain',
    color = 'inherit',
    size = 'medium',
    shape = 'circular',
    elevation,
    loading = false,
    loadingIndicator: loadingIndicatorProp,
    disabled = false,
    className,
    classes: classesProp,
    children,
    ...other
  } = props as IconButtonOwnProps & ButtonBaseOwnProps;

  const { classes, cx } = useStyles({
    variant,
    color,
    size,
    shape,
    elevation,
  }, { props: { classes: classesProp } });

  const loadingIndicator = loadingIndicatorProp ?? (
    <CircularProgress color="inherit" size={LOADING_INDICATOR_SIZES[size]} />
  );

  return (
    <ButtonBase
      ref={ref}
      className={cx(classes.root, {
        [classes.surface]: variant === 'surface',
        [classes.circular]: shape === 'circular',
        [classes.rounded]: shape === 'rounded',
      }, 'engage__icon-button', className)}
      disableBaseClassName
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-shape={shape}
      data-loading={loading || undefined}
      disabled={disabled || loading}
      {...other}
    >
      {loading ? loadingIndicator : children}
    </ButtonBase>
  );
}

// Edge length of the square hit area per size. The icon is sized by the matching `components.icon`
// token, so the padding around it follows from the difference.
const BOX_SIZES: Record<IconButtonSize, number> = {
  small: 32,
  medium: 40,
  large: 48,
};

// Diameter of the default loading indicator per size, smaller than the icon it stands in for.
const LOADING_INDICATOR_SIZES: Record<IconButtonSize, number> = {
  small: 16,
  medium: 20,
  large: 24,
};

/**
 * Resolves an `elevation` prop into a box-shadow.
 * @param theme The active theme.
 * @param elevation A `theme.shadows` index, or a size of `theme.shadowSizes`.
 * @returns The box-shadow value.
 */
const resolveElevation = (theme: Theme, elevation: number | ShadowSize) => (
  typeof elevation === 'number' ? theme.shadows[elevation] : theme.shadowSizes[elevation]
);

// Share of the overlay the button tints itself with on hover, in percent. The dark scheme needs
// more of it: the overlay takes the color of the icon, and a light tint over a dark surface reads
// as less.
const HOVER_OVERLAY_PERCENT = 10;
const HOVER_OVERLAY_PERCENT_DARK = 28;

// The background a button paints before the hover overlay. Only `surface` publishes it, so a plain
// button falls back to no background of its own.
const BASE_BACKGROUND = 'var(--icon-button-background, transparent)';

type StyleParams =
  Required<Pick<IconButtonOwnProps, 'variant' | 'color' | 'size' | 'shape'>>
  & Pick<IconButtonOwnProps, 'elevation'>;

const useStyles = makeStyles<StyleParams>({
  name: 'IconButton',
})((theme, props) => {
  const { color, size, elevation } = props;

  let cssColor = 'currentColor';

  if (color === 'cta') {
    cssColor = theme.components.ctaButton.background;
  } else if (color !== 'inherit') {
    cssColor = theme.palette?.[color]?.main
      ? theme.palette[color].main
      : theme.palette.primary.main;
  }

  // Mixing the tint into the base keeps an opaque surface visible underneath. Declaring a
  // translucent color instead would replace it, since this rule outranks the `surface` class.
  const hoverBackground = (percent: number) => (
    `color-mix(in srgb, ${cssColor} ${percent}%, ${BASE_BACKGROUND})`
  );

  return {
    root: {
      '--icon-button-color': cssColor,
      backgroundColor: BASE_BACKGROUND,
      boxShadow: `var(${theme.vars.components.iconButton.boxShadow}, ${
        elevation === undefined ? 'none' : resolveElevation(theme, elevation)
      })`,
      color: 'var(--icon-button-color)',
      width: BOX_SIZES[size],
      height: BOX_SIZES[size],
      fontSize: theme.components.icon[size],
      lineHeight: 1,
      transition: theme.transitions.create(['background-color', 'box-shadow'], {
        duration: theme.transitions.duration.short,
      }),

      // A disabled button keeps taking pointer events so that it can show a not-allowed cursor,
      // which leaves it matching `:hover`.
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: hoverBackground(HOVER_OVERLAY_PERCENT),
        ...theme.applyStyles('dark', {
          backgroundColor: hoverBackground(HOVER_OVERLAY_PERCENT_DARK),
        }),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: BASE_BACKGROUND,
        },
      },

      '&:disabled, &[aria-disabled="true"]': {
        color: theme.palette.action.disabled,
      },
    },
    surface: {
      '--icon-button-background': theme.components.iconButton.background,
    },
    circular: {
      borderRadius: '50%',
    },
    rounded: {
      borderRadius: theme.components.iconButton.borderRadius,
    },
  };
});

export type IconButtonSize = 'small' | 'medium' | 'large';

export interface IconButtonOwnProps {
  /**
   * Accessible name of the button. Required, because an icon carries no text of its own.
   */
  'aria-label': string;
  /**
   * `plain` draws no background, `surface` the themed surface that floating buttons sit on.
   * @default 'plain'
   */
  variant?: 'plain' | 'surface';
  /**
   * The color of the icon.
   * @default 'inherit'
   */
  color?: PaletteColorsWithMain | 'inherit' | 'cta';
  /**
   * The size of the component. Sets both the hit area and the icon.
   * @default 'medium'
   */
  size?: IconButtonSize;
  /**
   * Corner rounding. `rounded` uses the `components.iconButton.borderRadius` theme token.
   * @default 'circular'
   */
  shape?: 'circular' | 'rounded';
  /**
   * Depth of the drop shadow. A number indexes `theme.shadows`, a `ShadowSize` resolves through
   * `theme.shadowSizes`. Only drawn while the `components.iconButton.boxShadow` token is unset.
   */
  elevation?: number | ShadowSize;
  /**
   * If `true`, the icon is replaced by a loading indicator and the button is disabled.
   * @default false
   */
  loading?: boolean;
  /**
   * Replaces the icon while the button is loading. By default it renders a `CircularProgress`.
   */
  loadingIndicator?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ReturnType<typeof useStyles>['classes']>;
  /**
   * The icon to render.
   */
  children: React.ReactNode;
}

export type IconButtonProps<C extends React.ElementType = 'button'> =
  IconButtonOwnProps & ButtonBaseProps<C>;

const IconButtonWithRef = forwardRef(IconButton);

IconButtonWithRef.displayName = 'IconButton';

// `forwardRef` erases the generic, so the call signature is restored with a cast. The cast has to
// land on a named binding rather than on the export itself, or hovering an import of this component
// resolves to an anonymous function type and shows no documentation at all.
/**
 * The IconButton component renders an icon as a click target of its own. Unlike `Button` it carries
 * no label, so it sizes itself to a square hit area and takes its accessible name from `aria-label`.
 */
const IconButtonComponent = IconButtonWithRef as <C extends React.ElementType = 'button'>(
  props: IconButtonProps<C> & { ref?: React.ComponentPropsWithRef<C>['ref'] }
) => React.ReactElement | null;

export default IconButtonComponent;
