import React, { useMemo } from 'react';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import type { PaletteColorsWithMain } from '@shopgate/engage/styles';
import { VisuallyHidden } from '@shopgate/engage/a11y/components';

/**
 * The size of the switch.
 */
export type SwitchSize = 'medium' | 'large';

/**
 * Where the label is placed: before the switch or behind it. The spacing is the same for both.
 */
export type SwitchLabelPlacement = 'start' | 'end';

/**
 * Class names that are added to the elements of the switch.
 */
export interface SwitchClasses {
  /**
   * The root element.
   */
  root: string;
  /**
   * The root element, when the label is placed after the switch.
   */
  labelEnd: string;
  /**
   * The root element, when the label sits right next to the switch.
   */
  disableSpacing: string;
  /**
   * The input, which is drawn as the switch.
   */
  input: string;
  /**
   * The input, when the switch has the large size.
   */
  large: string;
  /**
   * The label.
   */
  label: string;
}

export interface SwitchProps {
  /**
   * Whether the switch is on.
   */
  checked?: boolean;
  /**
   * Whether the switch can't be changed.
   */
  disabled?: boolean;
  /**
   * Called when the user flips the switch.
   */
  onChange?: ((event: ChangeEvent<HTMLInputElement>) => void) | null;
  /**
   * The id of the input, which links it with the label. A random one is used when it's missing.
   */
  id?: string | null;
  /**
   * A text for screen readers, for layouts in which the regular label can't be read reliably.
   */
  a11yFallbackText?: string | null;
  /**
   * The label of the switch.
   */
  children?: ReactNode;
  /**
   * The palette color of the track while the switch is on. `inherit` takes the text color of the
   * surrounding element, so any color can be set with CSS, e.g. on the root via `className`.
   * @default 'secondary'
   */
  color?: PaletteColorsWithMain | 'inherit';
  /**
   * The size of the switch: `medium` is 40 by 20 pixels, `large` 48 by 28.
   * @default 'medium'
   */
  size?: SwitchSize;
  /**
   * `start` puts the label before the switch, `end` behind it. Only the order changes.
   * @default 'start'
   */
  labelPlacement?: SwitchLabelPlacement;
  /**
   * Puts the label right next to the switch instead of at the opposite edge of the available
   * width.
   * @default false
   */
  disableSpacing?: boolean;
  /**
   * A class name for the root element.
   */
  className?: string;
  /**
   * Class names for the elements of the switch, to override or extend their styles.
   */
  classes?: Partial<SwitchClasses>;
  /**
   * The name of the input, for use in forms.
   */
  name?: string;
  /**
   * Further attributes of the input, e.g. `{ role: 'switch' }` to announce it as a switch
   * instead of a checkbox.
   */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

/**
 * The values the styles of the switch depend on.
 */
interface SwitchStyleParams {
  /**
   * The palette color of the track while the switch is on, or `inherit`.
   */
  color: PaletteColorsWithMain | 'inherit';
}

const useStyles = makeStyles<SwitchStyleParams>()((theme, { color }) => ({
  root: {
    display: 'flex',
    flex: 1,
    textAlign: 'left',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    gap: 32,
  },
  labelEnd: {
    flexDirection: 'row',
  },
  disableSpacing: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  input: {
    display: 'flex',
    flexShrink: 0,
    appearance: 'none',
    width: 40,
    height: 20,
    backgroundColor: `var(${theme.vars.components.switch.trackColor}, ${theme.palette.grey.medium})`,
    borderRadius: 10,
    position: 'relative',
    cursor: 'pointer',
    ...(color === 'inherit' ? { color: 'inherit' } : null),

    ':before': {
      content: '""',
      position: 'absolute',
      top: 2,
      left: 2,
      width: 16,
      height: 16,
      backgroundColor: `var(${theme.vars.components.switch.thumbColor}, ${theme.palette.common.white})`,
      borderRadius: '50%',
      transition: 'transform 0.3s',
    },
    ':checked': {
      backgroundColor: `var(${theme.vars.components.switch.checkedTrackColor}, ${color === 'inherit' ? 'currentColor' : theme.palette[color].main})`,
    },
    ':checked::before': {
      transform: 'translateX(20px)',
    },
    ':disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      cursor: 'not-allowed',
    },
    '@media (prefers-reduced-motion: reduce)': {
      ':before': {
        transition: 'none',
      },
    },
  },
  large: {
    width: 48,
    height: 28,
    borderRadius: 14,

    ':before': {
      width: 24,
      height: 24,
    },
  },
}));

/**
 * A switch that turns a setting on or off. It's a checkbox that looks like a switch, with the
 * label next to it.
 * @param props The component props.
 * @param props.checked Whether the switch is on.
 * @param props.disabled Whether the switch can't be changed.
 * @param props.onChange Called when the user flips the switch.
 * @param props.id The id of the input.
 * @param props.a11yFallbackText A text for screen readers that replaces the label.
 * @param props.children The label.
 * @param props.color The palette color of the track while the switch is on, or `inherit`.
 * @param props.size The size of the switch.
 * @param props.labelPlacement Where the label is placed.
 * @param props.disableSpacing Whether the label sits right next to the switch.
 * @param props.className A class name for the root element.
 * @param props.classes Class names for the elements of the switch.
 * @param props.name The name of the input.
 * @param props.inputProps Further attributes of the input.
 * @returns The switch.
 */
const Switch = ({
  disabled = false,
  checked = false,
  onChange = null,
  id = null,
  a11yFallbackText = null,
  children = null,
  color = 'secondary',
  size = 'medium',
  labelPlacement = 'start',
  disableSpacing = false,
  className,
  classes: classesProp,
  name,
  inputProps,
}: SwitchProps) => {
  const { classes, cx } = useStyles({ color }, { props: { classes: classesProp } });
  const switchId = useMemo(() => id || String(Math.random()), [id]);

  return (
    <div
      className={cx(
        classes.root,
        {
          [classes.labelEnd]: labelPlacement === 'end',
          [classes.disableSpacing]: disableSpacing,
        },
        'engage__switch',
        className
      )}
    >
      <input
        {...inputProps}
        type="checkbox"
        name={name}
        disabled={disabled}
        checked={checked}
        onChange={onChange ?? undefined}
        className={cx(
          classes.input,
          { [classes.large]: size === 'large' },
          'engage__switch__input',
          inputProps?.className
        )}
        id={switchId}
      />

      {children && (
        <label htmlFor={switchId} className={cx('engage__switch__label', classesProp?.label)}>
          <span aria-hidden={!!a11yFallbackText}>
            {children}
          </span>
          {a11yFallbackText && (
            <VisuallyHidden>
              {a11yFallbackText}
            </VisuallyHidden>
          )}
        </label>
      )}
    </div>
  );
};

export default Switch;
