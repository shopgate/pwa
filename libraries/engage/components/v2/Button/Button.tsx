import { forwardRef } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import type { OwnProps } from '@shopgate/engage/types/react';
import type { PaletteColorsWithMain } from '@shopgate/engage/styles';
import CircularProgress from '../CircularProgress';
import ButtonBase from '../ButtonBase';
import type { ButtonBaseProps } from '../ButtonBase';

export interface ButtonProps extends ButtonBaseProps {
  /**
   * The variant to use.
   * @default 'contained'
   */
  variant?: 'contained' | 'outlined' | 'text';
  /**
   * The color of the component.
   * @default 'primary'
   */
  color?: PaletteColorsWithMain;
  /**
   * If `true`, no elevation is used.
   * @default false
   */
  disableElevation?: boolean;
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
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ReturnType<typeof useStyles>['classes']>;
}

type UseStylesProps = OwnProps<
  ButtonProps,
  Omit<ButtonBaseProps, 'color'>>

const useStyles = makeStyles<UseStylesProps>({
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

  if (color) {
    cssColor = theme.palette?.[color]?.main
      ? theme.palette[color].main
      : theme.palette.primary.main;

    contrastText = theme.palette?.[color]?.contrastText
      ? theme.palette[color].contrastText
      : theme.palette.primary.contrastText;
  }

  return {
    root: {
      '--sg-button-border-radius': theme.components.button.borderRadius,
      '--sg-button-font-size': theme.typography.button.fontSize,

      '--sg-button-variant-textColor': cssColor,
      '--sg-button-variant-textDisabledColor': theme.palette.action.disabled,

      '--sg-button-variant-outlinedColor': cssColor,
      '--sg-button-variant-outlinedBorder': cssColor,
      '--sg-button-variant-outlinedDisabledColor': theme.palette.action.disabled,
      '--sg-button-variant-outlinedDisabledBorder': theme.palette.action.disabled,

      '--sg-button-variant-containedColor': contrastText,
      '--sg-button-variant-containedBg': cssColor,
      '--sg-button-variant-containedDisabledColor': theme.palette.action.disabled,
      '--sg-button-variant-containedDisabledBg': theme.palette.action.disabledBackground,

      '--sg-button-icon-size': theme.vars.typography.button.fontSize,
      ...theme.typography.button,
      fontSize: 'var(--sg-button-font-size)',
      boxSizing: 'border-box',
      minWidth: 64,
      padding: '6px 16px',
      transition: theme.transitions.create(['background-color', 'box-shadow', 'border'], {
        duration: theme.transitions.duration.short,
      }),
      borderRadius: 'var(--sg-button-border-radius)',

      '&:hover': {
        '--sg-button-variant-textBg': theme.alpha(cssColor, 0.1),
        '--sg-button-variant-outlinedBg': theme.alpha(cssColor, 0.1),
        textDecoration: 'none',
        '&:disabled': {
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
      '--sg-button-font-size': `calc(${theme.typography.button.fontSize} * 0.875)`,
      padding: '4px 10px',
    },
    large: {
      '--sg-button-font-size': `calc(${theme.typography.button.fontSize} * 1.125)`,
      padding: '8px 22px',
    },
    disabled: {},
    text: {
      color: 'var(--sg-button-variant-textColor)',
      background: 'var(--sg-button-variant-textBg)',
      '&:disabled': {
        color: 'var(--sg-button-variant-textDisabledColor)',
      },
    },
    outlined: {
      color: 'var(--sg-button-variant-outlinedColor)',
      border: '1px solid var(--sg-button-variant-outlinedBorder)',
      background: 'var(--sg-button-variant-outlinedBg)',
      '&:disabled': {
        border: '1px solid var(--sg-button-variant-outlinedDisabledBorder)',
        color: 'var(--sg-button-variant-outlinedDisabledColor)',
      },
    },
    contained: {
      color: 'var(--sg-button-variant-containedColor)',
      background: 'var(--sg-button-variant-containedBg)',
      boxShadow: theme.shadows[2],
      '&:hover': {
        background: theme.darken('var(--sg-button-variant-containedBg)'),
        boxShadow: theme.shadows[4],
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          background: 'var(--sg-button-variant-containedBg)',
          boxShadow: theme.shadows[2],
        },
      },
      '&:active': {
        boxShadow: theme.shadows[8],
      },
      '&:disabled': {
        color: 'var(--sg-button-variant-containedDisabledColor)',
        backgroundColor: 'var(--sg-button-variant-containedDisabledBg)',
        boxShadow: theme.shadows[0],
      },
    },
    disableElevation: {
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none',
      },
      '&:active': {
        boxShadow: 'none',
      },
      '&$disabled': {
        boxShadow: 'none',
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
      fontSize: 'calc(var(--sg-button-font-size) * 1.4)',
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
        marginLeft: -2,
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
      ...(variant === 'text' && loadingPosition === 'end' && {
        right: 6,
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

/**
 * The Button component is a versatile UI element that can be used to trigger actions or navigate users.
 * It supports multiple variants, colors, and sizes, making it suitable for a wide range of use cases.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    variant = 'contained',
    color = 'primary',
    startIcon: startIconProp,
    endIcon: endIconProp,
    loading = false,
    loadingPosition = 'center',
    loadingIndicator: loadingIndicatorProp,
    size = 'medium',
    disabled = false,
    fullWidth = false,
    disableElevation = false,
    className,
    children,
    ...other
  } = props;

  const { classes, cx } = useStyles({
    color,
    size,
    loadingPosition,
    loading,
    fullWidth,
  });

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
      ref={ref}
      className={cx(classes.root, className, {
        [classes.text]: variant === 'text',
        [classes.outlined]: variant === 'outlined',
        [classes.contained]: variant === 'contained',
        [classes.small]: size === 'small',
        [classes.large]: size === 'large',
        [classes.disabled]: disabled || loading,
        [classes.fullWidth]: fullWidth,
        [classes.disableElevation]: disableElevation,
      })}
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
});

export default Button;
