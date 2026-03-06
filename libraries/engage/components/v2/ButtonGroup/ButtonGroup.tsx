import React, { forwardRef } from 'react';
import capitalize from 'lodash/capitalize';
import { makeStyles } from '@shopgate/engage/styles';
import type { OwnProps } from '@shopgate/engage/types/react';
import type { PaletteColorsWithMain } from '@shopgate/engage/styles';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
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
   * The orientation of the buttons in the group.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * If true, no elevation is used for contained buttons.
   * @default false
   */
  disableElevation?: boolean;
  /**
   * The color of the component.
   * @default 'default'
   */
  color?: PaletteColorsWithMain | 'default';
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

type UseStylesProps = OwnProps<
  ButtonGroupProps,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>
>;

const useStyles = makeStyles<UseStylesProps>({
  name: 'ButtonGroup',
})((theme, props) => {
  const { color, variant } = props;

  let cssColor = '';

  if (color !== 'default') {
    cssColor = color && theme.palette?.[color]?.main
      ? theme.palette[color].main
      : theme.palette.primary.main;
  } else if (variant === 'contained') {
    // eslint-disable-next-line prefer-destructuring
    cssColor = theme.palette.grey[200];
  } else {
    cssColor = theme.palette.text.contrastLight;
  }

  return {
    root: {
      '--accent-color': `var(${theme.vars.components.button.color}, ${cssColor})`,
      '--disabledColor': theme.palette.action.disabled,
      '&& button': {
        // Override button border radius with group border radius
        // [theme.vars.components.button.borderRadius]: theme.components.buttonGroup.borderRadius,
      },
      display: 'inline-flex',
      borderRadius: `var(${theme.vars.components.button.borderRadius}, ${theme.shape.borderRadius})`,
    },
    contained: {
      boxShadow: theme.shadows[2],
    },
    disabled: {},
    disableElevation: {
      boxShadow: 'none',
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
        borderRightColor: theme.darken('var(--accent-color)'),
        '&:disabled': {
          borderRightColor: 'var(--disabledColor)',
        },
      },
    },
    groupedContainedVertical: {
      '&:not(:last-of-type)': {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.darken('var(--accent-color)'),
        '&:disabled': {
          borderBottomColor: 'var(--disabledColor)',
        },
      },
    },
    groupedOutlined: {
      borderColor: `${theme.lighten('var(--accent-color)', 0.5)} !important`,
      '&:hover': {
        borderColor: 'var(--accent-color)',
      },
      '&:disabled': {
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
    groupedText: {

    },
    groupedTextHorizontal: {
      '&&:not(:last-of-type)': {
        borderRightWidth: 1,
        borderRightStyle: 'solid',
        borderRightColor: `${theme.lighten('var(--accent-color)', 0.5)}`,
        '&:disabled': {
          borderRightColor: 'var(--disabledColor)',
        },
      },
    },
    groupedTextVertical: {
      '&&:not(:last-of-type)': {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: `${theme.lighten('var(--accent-color)', 0.5)}`,
        '&:disabled': {
          borderBottomColor: 'var(--disabledColor)',
        },
      },
    },
    /* eslint-enable tss-unused-classes/unused-classes */
  };
});

/**
 * The ButtonGroup component can be used to group related buttons.
 */
const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>((props, ref) => {
  const {
    variant = 'contained',
    size = 'medium',
    orientation = 'horizontal',
    disableElevation = false,
    fullWidth = false,
    disableRipple = false,
    disabled = false,
    color = 'default',
    className,
    children,
    ...other
  } = props;

  const { classes, cx } = useStyles({
    color,
    variant,
  }, { props: { classes: props.classes } });

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
        [classes.contained]: variant === 'contained',
        [classes.vertical]: orientation === 'vertical',
        [classes.fullWidth]: fullWidth,
        [classes.disableElevation]: disableElevation,
      }, className)}
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
          disableElevation: child.props.disableElevation || disableElevation,
          disableRipple,
          fullWidth,
          size: child.props.size || size,
          variant: child.props.variant || variant,
        });
      })}
    </div>
  );
});

export default ButtonGroup;
