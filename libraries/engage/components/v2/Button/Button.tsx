import React, { forwardRef } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import type { PaletteColorsWithMain } from '@shopgate/engage/styles';
import CircularProgress from '../CircularProgress';
import ButtonBase from '../ButtonBase';
import type { ButtonBaseOwnProps, ButtonBaseProps } from '../ButtonBase';

/**
 * The Button component is a versatile UI element that can be used to trigger actions or navigate users.
 * It supports multiple variants, colors, and sizes, making it suitable for a wide range of use cases.
 */
function Button<C extends React.ElementType = 'button'>(
  props: ButtonProps<C>,
  ref: React.Ref<Element>
) {
  const {
    variant = 'contained',
    color = 'inherit',
    startIcon: startIconProp,
    endIcon: endIconProp,
    loading = false,
    loadingPosition = 'center',
    loadingIndicator: loadingIndicatorProp,
    size = 'medium',
    dense = false,
    disabled = false,
    fullWidth = false,
    enableElevation = false,
    className,
    classes: classesProp,
    children,
    ...other
  } = props as ButtonOwnProps & ButtonBaseOwnProps;

  const { classes, cx } = useStyles({
    color,
    size,
    variant,
    loadingPosition,
    loading,
    fullWidth,
  }, { props: { classes: classesProp } });

  const loadingIndicator = loadingIndicatorProp ?? (
    <CircularProgress color="inherit" size={16} />
  );

  const startIcon = (startIconProp || (loading && loadingPosition === 'start')) && (
    <span className={cx(classes.icon, classes.startIcon)}>
      {startIconProp || <span className={classes.loadingPlaceholder} />}
    </span>
  );
  const endIcon = (endIconProp || (loading && loadingPosition === 'end')) && (
    <span className={cx(classes.icon, classes.endIcon)}>
      {endIconProp || <span className={classes.loadingPlaceholder} />}
    </span>
  );

  const loader = typeof loading === 'boolean' ? (
    <span
      style={{ display: 'contents' }}
      className={cx(classes.loader, {
        [classes.startIcon]: loadingPosition === 'start',
        [classes.endIcon]: loadingPosition === 'end',
      })}
    >
      {loading && (
      <span className={classes.loadingIndicator}>
        { loadingIndicator }
      </span>
      )}

    </span>
  ) : null;

  return (
    <ButtonBase
      ref={ref as React.Ref<HTMLButtonElement>}
      className={cx(classes.root, {
        [classes.text]: variant === 'text',
        [classes.outlined]: variant === 'outlined',
        [classes.contained]: variant === 'contained',
        [classes.small]: size === 'small',
        [classes.large]: size === 'large',
        [classes.dense]: dense && size === 'medium',
        [classes.denseSmall]: dense && size === 'small',
        [classes.denseLarge]: dense && size === 'large',
        [classes.disabled]: disabled || loading,
        [classes.fullWidth]: fullWidth,
        [classes.enableElevation]: enableElevation,
      }, className)}
      disabled={disabled || loading}
      {...other}
    >
      <span className={classes.label}>
        {startIcon}
        {loadingPosition !== 'end' && loader}
        {children}
        {loadingPosition === 'end' && loader}
        {endIcon}
      </span>
    </ButtonBase>
  );
}

const useStyles = makeStyles<ButtonOwnProps>({
  name: 'Button',
})((theme, props) => {
  const {
    color,
    size,
    loadingPosition,
    loading,
    fullWidth,
    variant,
  } = props;

  let cssColor = '';
  let contrastText = '';

  if (color === 'cta') {
    // The call to action color is not part of the palette. It's a component token so that merchants
    // can configure it separately from the primary color via `--color-button-cta`.
    cssColor = theme.components.ctaButton.background;
    contrastText = theme.components.ctaButton.color;
  } else if (color !== 'inherit') {
    cssColor = color && theme.palette?.[color]?.main
      ? theme.palette[color].main
      : theme.palette.primary.main;

    contrastText = color && theme.palette?.[color]?.contrastText
      ? theme.palette[color].contrastText
      : theme.palette.primary.contrastText;
  } else if (variant === 'contained') {
    // eslint-disable-next-line prefer-destructuring
    cssColor = theme.palette.grey[200];
    contrastText = 'inherit';
  } else {
    cssColor = 'currentColor';
  }

  return {
    root: {
      // The `components.button` vars are override hooks for CSS injection and are intentionally
      // left unseeded, so these fallbacks are what render by default. Don't "fix" the empty values
      // by skipping their generation - that would also drop them from `theme.vars`, which would
      // turn these into `var(undefined, ...)`.
      '--button-color': `var(${theme.vars.components.button.color}, ${cssColor})`,
      '--text-color': `var(${theme.vars.components.button.textColor}, ${contrastText})`,
      '--border-radius': `var(${theme.vars.components.button.borderRadius}, ${theme.shape.borderRadius})`,

      '--font-size': theme.typography.button.fontSize,

      '--variant-textColor': 'var(--button-color)',
      '--variant-textDisabledColor': theme.palette.action.disabled,

      '--variant-outlinedColor': 'var(--button-color)',
      '--variant-outlinedBorder': 'var(--button-color)',
      '--variant-outlinedDisabledColor': theme.palette.action.disabled,
      '--variant-outlinedDisabledBorder': theme.palette.action.disabled,

      '--variant-containedColor': 'var(--text-color)',
      '--variant-containedBg': 'var(--button-color)',
      '--variant-containedDisabledColor': theme.palette.action.disabled,
      '--variant-containedDisabledBg': theme.palette.action.disabledBackground,

      ...theme.typography.button,
      fontSize: 'var(--font-size)',
      boxSizing: 'border-box',
      minWidth: 64,
      // Every variant reserves the same 1px border box, so that an outlined button doesn't render
      // 2px larger than a contained one. The paddings are 1px smaller than they look because of it.
      border: '1px solid transparent',
      padding: '5px 15px',
      transition: theme.transitions.create(['background-color', 'box-shadow', 'border'], {
        duration: theme.transitions.duration.short,
      }),
      borderRadius: 'var(--border-radius)',

      '&:hover': {
        '--variant-textBg': theme.alpha(cssColor, 0.1),
        '--variant-outlinedBg': theme.alpha(cssColor, 0.1),
        textDecoration: 'none',
        '&:disabled, &[aria-disabled="true"]': {
          backgroundColor: 'transparent',
        },
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
      ...(loading && loadingPosition === 'center' && {

      }),
    },
    small: {
      '--font-size': `calc(${theme.typography.button.fontSize} * 0.875)`,
      padding: '4px 9px',
    },
    large: {
      '--font-size': `calc(${theme.typography.button.fontSize} * 1.125)`,
      padding: '7px 21px',
    },
    // The dense paddings roughly halve the regular ones. They are applied after the size classes,
    // so they win by declaration order without needing extra specificity.
    dense: {
      padding: '2px 7px',
    },
    denseSmall: {
      padding: '2px 4px',
    },
    denseLarge: {
      padding: '3px 10px',
    },
    disabled: {},
    text: {
      color: 'var(--variant-textColor)',
      background: 'var(--variant-textBg)',
      '&:disabled, &[aria-disabled="true"]': {
        color: 'var(--variant-textDisabledColor)',
      },
    },
    outlined: {
      color: 'var(--variant-outlinedColor)',
      borderColor: 'var(--variant-outlinedBorder)',
      background: 'var(--variant-outlinedBg)',
      '&:disabled, &[aria-disabled="true"]': {
        borderColor: 'var(--variant-outlinedDisabledBorder)',
        color: 'var(--variant-outlinedDisabledColor)',
      },
    },
    contained: {
      color: 'var(--variant-containedColor)',
      background: 'var(--variant-containedBg)',
      '&:hover': {
        background: theme.darken('var(--variant-containedBg)'),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          background: 'var(--variant-containedBg)',
        },
      },
      '&:disabled, &[aria-disabled="true"]': {
        color: 'var(--variant-containedDisabledColor)',
        backgroundColor: 'var(--variant-containedDisabledBg)',
      },
    },
    enableElevation: {
      boxShadow: theme.shadows[2],
      '&:hover': {
        boxShadow: theme.shadows[4],
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          boxShadow: theme.shadows[2],
        },
      },
      '&:active': {
        boxShadow: theme.shadows[6],
      },
      '&:disabled, &[aria-disabled="true"]': {
        boxShadow: theme.shadows[0],
      },
    },
    label: {
      width: '100%',
      display: 'inherit',
      alignItems: 'inherit',
      justifyContent: 'inherit',
      ...(loading && loadingPosition === 'center' && {
        transition: theme.transitions.create(
          ['background-color', 'box-shadow', 'border-color'],
          {
            duration: theme.transitions.duration.short,
          }
        ),
        color: 'transparent',
      }),
    },
    fullWidth: {
      width: '100%',
    },
    icon: {
      fontSize: 'calc(var(--font-size) * 1.4)',
    },
    startIcon: {
      flexShrink: 0,
      display: 'inherit',
      marginRight: 8,
      marginLeft: -4,
      ...(size === 'small' && {
        marginLeft: -2,
      }),
      ...(loading && loadingPosition === 'start' && {
        transition: theme.transitions.create('opacity', {
          duration: theme.transitions.duration.short,
        }),
        opacity: 0,
      }),
      ...(loading && loadingPosition === 'start' && fullWidth && {
        marginRight: -8,
      }),
    },
    endIcon: {
      flexShrink: 0,
      display: 'inherit',
      marginRight: -4,
      marginLeft: 8,
      ...(size === 'small' && {
        marginRight: -2,
      }),
      ...(loading && loadingPosition === 'end' && {
        transition: theme.transitions.create('opacity', {
          duration: theme.transitions.duration.short,
        }),
        opacity: 0,
      }),
      ...(loading && loadingPosition === 'end' && fullWidth && {
        marginLeft: -8,
      }),
    },
    loader: {
      position: 'absolute',
      left: 0,
    },
    loadingPlaceholder: {
      display: 'inline-block',
      width: '1em',
      height: '1em',
    },
    loadingIndicator: {
      display: 'none',
      position: 'absolute',
      visibility: 'visible',
      ...(loading && {
        display: 'flex',
      }),
      ...(loadingPosition === 'start' && {
        left: 14,
      }),
      ...(loadingPosition === 'start' && size === 'small' && {
        left: 10,
      }),
      ...(loadingPosition === 'center' && {
        left: '50%',
        transform: 'translateX(-50%)',
        color: theme.palette.action.disabled,
      }),
      ...(loadingPosition === 'end' && {
        right: 14,
      }),
      ...(loadingPosition === 'end' && size === 'small' && {
        right: 10,
      }),
      ...(loadingPosition === 'end' && size === 'large' && {
        right: 20,
      }),
      ...(loadingPosition === 'start' && fullWidth && {
        position: 'relative',
        left: -10,
      }),
      ...(loadingPosition === 'end' && fullWidth && {
        position: 'relative',
        right: -10,
      }),
    },
  };
});

export interface ButtonOwnProps<C extends React.ElementType = 'button'> {
  /**
   * The variant to use.
   * @default 'contained'
   */
  variant?: 'contained' | 'outlined' | 'text';
  /**
   * The color of the component.
   * @default 'inherit'
   */
  color?: PaletteColorsWithMain | 'inherit' | 'cta';
  /**
   * If `true`, a drop shadow is added to the button. Buttons are flat by default.
   * @default false
   */
  enableElevation?: boolean;
  /**
   * Element placed before the children.
   */
  startIcon?: React.ReactNode;
  /**
   * Element placed after the children.
   */
  endIcon?: React.ReactNode;
  /**
   * Element placed before the children if the button is in loading state.
   * By default, it renders a `CircularProgress`.
   */
  loadingIndicator?: React.ReactNode;
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * If `true`, the button will show a loading indicator and be disabled.
   * @default false
   */
  loading?: boolean;
  /**
   * The loading indicator can be positioned on the start, end, or the center of the button.
   * @default 'center'
   */
  loadingPosition?: 'start' | 'end' | 'center';
  /**
   * The size of the component.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If `true`, the button uses reduced padding. Combines with `size`, which keeps controlling the
   * font size.
   * @default false
   */
  dense?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ReturnType<typeof useStyles>['classes']>;
}

export type ButtonProps<C extends React.ElementType = 'button'> =
  ButtonOwnProps<C> & ButtonBaseProps<C>;

const ButtonWithRef = forwardRef(Button);

ButtonWithRef.displayName = 'Button';

// `forwardRef` erases the generic, so the call signature is restored with a cast.
export default ButtonWithRef as <C extends React.ElementType = 'button'>(
  props: ButtonProps<C> & { ref?: React.ComponentPropsWithRef<C>['ref'] }
) => React.ReactElement | null;
