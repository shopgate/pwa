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
   * @default 'default'
   */
  color?: PaletteColorsWithMain | 'default';
  /**
   * If `true`, no elevation is used for contained buttons.
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

  if (color !== 'default') {
    cssColor = color && theme.palette?.[color]?.main
      ? theme.palette[color].main
      : theme.palette.primary.main;

    contrastText = color && theme.palette?.[color]?.contrastText
      ? theme.palette[color].contrastText
      : theme.palette.primary.contrastText;
  } else if (variant === 'contained') {
    // eslint-disable-next-line prefer-destructuring
    cssColor = theme.palette.grey[200];
    contrastText = theme.palette.text.contrastLight;
  } else {
    cssColor = theme.palette.text.contrastLight;
  }

  return {
    root: {
      '--accent-color': `var(${theme.vars.components.button.color}, ${cssColor})`,
      '--text-color': `var(${theme.vars.components.button.textColor}, ${contrastText})`,
      '--border-radius': `var(${theme.vars.components.button.borderRadius}, ${theme.shape.borderRadius})`,

      '--font-size': theme.typography.button.fontSize,

      '--variant-textColor': 'var(--accent-color)',
      '--variant-textDisabledColor': theme.palette.action.disabled,

      '--variant-outlinedColor': 'var(--accent-color)',
      '--variant-outlinedBorder': 'var(--accent-color)',
      '--variant-outlinedDisabledColor': theme.palette.action.disabled,
      '--variant-outlinedDisabledBorder': theme.palette.action.disabled,

      '--variant-containedColor': 'var(--text-color)',
      '--variant-containedBg': 'var(--accent-color)',
      '--variant-containedDisabledColor': theme.palette.action.disabled,
      '--variant-containedDisabledBg': theme.palette.action.disabledBackground,

      '--icon-size': theme.vars.typography.button.fontSize,
      ...theme.typography.button,
      fontSize: 'var(--font-size)',
      boxSizing: 'border-box',
      minWidth: 64,
      padding: '6px 16px',
      transition: theme.transitions.create(['background-color', 'box-shadow', 'border'], {
        duration: theme.transitions.duration.short,
      }),
      borderRadius: 'var(--border-radius)',

      '&:hover': {
        '--variant-textBg': theme.alpha(cssColor, 0.1),
        '--variant-outlinedBg': theme.alpha(cssColor, 0.1),
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
      '--font-size': `calc(${theme.typography.button.fontSize} * 0.875)`,
      padding: '4px 10px',
    },
    large: {
      '--font-size': `calc(${theme.typography.button.fontSize} * 1.125)`,
      padding: '8px 22px',
    },
    disabled: {},
    text: {
      color: 'var(--variant-textColor)',
      background: 'var(--variant-textBg)',
      '&:disabled': {
        color: 'var(--variant-textDisabledColor)',
      },
    },
    outlined: {
      color: 'var(--variant-outlinedColor)',
      border: '1px solid var(--variant-outlinedBorder)',
      background: 'var(--variant-outlinedBg)',
      '&:disabled': {
        border: '1px solid var(--variant-outlinedDisabledBorder)',
        color: 'var(--variant-outlinedDisabledColor)',
      },
    },
    contained: {
      color: 'var(--variant-containedColor)',
      background: 'var(--variant-containedBg)',
      boxShadow: theme.shadows[2],
      '&:hover': {
        background: theme.darken('var(--variant-containedBg)'),
        boxShadow: theme.shadows[4],
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          background: 'var(--variant-containedBg)',
          boxShadow: theme.shadows[2],
        },
      },
      '&:active': {
        boxShadow: theme.shadows[6],
      },
      '&:disabled': {
        color: 'var(--variant-containedDisabledColor)',
        backgroundColor: 'var(--variant-containedDisabledBg)',
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

/**
 * The Button component is a versatile UI element that can be used to trigger actions or navigate users.
 * It supports multiple variants, colors, and sizes, making it suitable for a wide range of use cases.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    variant = 'contained',
    color = 'default',
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
    variant,
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
