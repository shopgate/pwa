import React, { forwardRef } from 'react';
import capitalize from 'lodash/capitalize';
import { makeStyles } from '@shopgate/engage/styles';
import type { PaletteColorsWithMain } from '@shopgate/engage/styles';

/**
 * The ButtonGroup component can be used to group related buttons.
 */
const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>((props, ref) => {
  const {
    variant = 'contained',
    size = 'medium',
    dense = false,
    orientation = 'horizontal',
    enableElevation = false,
    fullWidth = false,
    disableRipple = false,
    disabled = false,
    color = 'inherit',
    className,
    classes: classesProp,
    children,
    ...other
  } = props;

  const { classes, cx } = useStyles({
    color,
    variant,
  }, { props: { classes: classesProp } });

  const buttonClassName = cx(
    classes.grouped,
    classes[`grouped${capitalize(orientation)}`],
    classes[`grouped${capitalize(variant)}`],
    classes[`grouped${capitalize(variant)}${capitalize(orientation)}`],
    {
      [classes.disabled]: disabled,
    }
  );

  return (
    <div
      role="group"
      className={cx(classes.root, {
        [classes.vertical]: orientation === 'vertical',
        [classes.fullWidth]: fullWidth,
        [classes.enableElevation]: enableElevation && variant === 'contained',
      }, 'engage__button-group', className)}
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-orientation={orientation}
      data-dense={dense || undefined}
      data-full-width={fullWidth || undefined}
      data-enable-elevation={enableElevation || undefined}
      data-disabled={disabled || undefined}
      ref={ref}
      {...other}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        return React.cloneElement(child, {
          className: cx(buttonClassName, child.props.className),
          color: child.props.color || color,
          disabled: child.props.disabled || disabled,
          enableElevation: child.props.enableElevation || enableElevation,
          disableRipple,
          fullWidth,
          size: child.props.size || size,
          dense: child.props.dense || dense,
          variant: child.props.variant || variant,
        });
      })}
    </div>
  );
});

const useStyles = makeStyles<Omit<ButtonGroupOwnProps, 'children'>>({
  name: 'ButtonGroup',
})((theme, props) => {
  const { color, variant } = props;

  let cssColor = '';

  if (color === 'cta') {
    cssColor = theme.components.ctaButton.background;
  } else if (color !== 'inherit') {
    cssColor = color && theme.palette?.[color]?.main
      ? theme.palette[color].main
      : theme.palette.primary.main;
  } else if (variant === 'contained') {
    // eslint-disable-next-line prefer-destructuring
    cssColor = theme.palette.grey[200];
  } else {
    cssColor = 'currentColor';
  }

  return {
    root: {
      '--button-group-color': `var(${theme.vars.components.button.color}, ${cssColor})`,
      '--disabledColor': theme.palette.action.disabled,
      display: 'inline-flex',
      borderRadius: `var(${theme.vars.components.button.borderRadius}, ${theme.shape.borderRadius})`,
    },
    disabled: {},
    enableElevation: {
      boxShadow: theme.shadows[2],
    },
    fullWidth: {
      width: '100%',
    },
    vertical: {
      flexDirection: 'column',
    },
    grouped: {
      minWidth: 40,
    },
    /* eslint-disable tss-unused-classes/unused-classes */
    groupedHorizontal: {
      '&:not(:first-of-type)': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
      '&:not(:last-of-type)': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
    groupedVertical: {
      '&:not(:first-of-type)': {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
      },
      '&:not(:last-of-type)': {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
      },
    },
    groupedContained: {
      boxShadow: 'none !important',
    },
    groupedContainedHorizontal: {
      '&:not(:last-of-type)': {
        borderRightWidth: 1,
        borderRightStyle: 'solid',
        borderRightColor: theme.darken('var(--button-group-color)'),
        '&:disabled, &[aria-disabled="true"]': {
          borderRightColor: 'var(--disabledColor)',
        },
      },
    },
    groupedContainedVertical: {
      '&:not(:last-of-type)': {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.darken('var(--button-group-color)'),
        '&:disabled, &[aria-disabled="true"]': {
          borderBottomColor: 'var(--disabledColor)',
        },
      },
    },
    groupedOutlined: {
      borderColor: `${theme.lighten('var(--button-group-color)', 0.5)} !important`,
      '&:hover': {
        borderColor: 'var(--button-group-color)',
      },
      '&:disabled, &[aria-disabled="true"]': {
        borderColor: 'var(--disabledColor) !important',
      },
    },
    groupedOutlinedHorizontal: {
      '&:not(:first-of-type)': {
        marginLeft: -1,
      },
      '&:not(:last-of-type)': {
        borderRightColor: 'transparent !important',
      },
    },
    groupedOutlinedVertical: {
      '&:not(:first-of-type)': {
        marginTop: -1,
      },
      '&:not(:last-of-type)': {
        borderBottomColor: 'transparent !important',
      },
    },
    // Text buttons need no shared styles, but the key has to exist because the class is looked up
    // dynamically as `grouped${capitalize(variant)}`.
    groupedText: {},
    groupedTextHorizontal: {
      '&&:not(:last-of-type)': {
        borderRightWidth: 1,
        borderRightStyle: 'solid',
        borderRightColor: `${theme.lighten('var(--button-group-color)', 0.5)}`,
        '&:disabled, &[aria-disabled="true"]': {
          borderRightColor: 'var(--disabledColor)',
        },
      },
    },
    groupedTextVertical: {
      '&&:not(:last-of-type)': {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: `${theme.lighten('var(--button-group-color)', 0.5)}`,
        '&:disabled, &[aria-disabled="true"]': {
          borderBottomColor: 'var(--disabledColor)',
        },
      },
    },
    /* eslint-enable tss-unused-classes/unused-classes */
  };
});

export interface ButtonGroupOwnProps {
  /**
   * The variant to use.
   * @default 'contained'
   */
  variant?: 'contained' | 'outlined' | 'text';
  /**
   * The size of the component.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If true, the buttons use reduced padding.
   * @default false
   */
  dense?: boolean;
  /**
   * The orientation of the buttons in the group.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * If true, a drop shadow is added to the group. Button groups are flat by default.
   * @default false
   */
  enableElevation?: boolean;
  /**
   * The color of the component. Besides the palette colors, `cta` is supported. It resolves to the
   * merchant configurable call to action color from `components.ctaButton`.
   * @default 'inherit'
   */
  color?: PaletteColorsWithMain | 'inherit' | 'cta';
  /**
   * If true, the buttons will take up the full width of their container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * If true, the ripple effect will be disabled.
   * @default false
   */
  disableRipple?: boolean;
  /**
   * If true, the buttons will be disabled.
   * @default false
   */
  disabled?: boolean;
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ReturnType<typeof useStyles>['classes']>;
  children: React.ReactNode;
}

export type ButtonGroupProps = ButtonGroupOwnProps & React.HTMLAttributes<HTMLDivElement>

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
