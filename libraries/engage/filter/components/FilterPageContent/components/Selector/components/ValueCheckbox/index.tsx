import { memo, useCallback } from 'react';
import type { ComponentType, ReactNode } from 'react';
import noop from 'lodash/noop';
import { Checkbox } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

/**
 * `Checkbox` is untyped JavaScript whose optional props read as required from TypeScript.
 */
const CheckboxField = Checkbox as unknown as ComponentType<{
  name: string;
  label: ReactNode;
  checked?: boolean;
  onChange?: () => void;
  className?: string;
  checkboxClassName?: string;
}>;

const useStyles = makeStyles()(theme => ({
  root: {
    paddingBottom: 0,
    marginLeft: 0,
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.75, 0),
  },
  label: {
    paddingLeft: theme.spacing(1),
  },
}));

export interface ValueCheckboxProps {
  /**
   * Id of the filter value. Also used as the form element name and test id.
   */
  id: string;
  /**
   * Display label of the filter value. Rendered as is — never translated.
   */
  label: string;
  /**
   * Whether the value is currently selected.
   */
  isActive?: boolean;
  /**
   * Invoked with the value id whenever the checkbox is toggled.
   */
  onToggle?: (id: string) => void;
}

/**
 * A single selectable value of a filter on the filter page.
 * @returns The rendered component.
 */
const ValueCheckbox = ({
  id,
  label,
  isActive = false,
  onToggle = noop,
}: ValueCheckboxProps) => {
  const { classes } = useStyles();

  const handleChange = useCallback(() => {
    onToggle(id);
  }, [id, onToggle]);

  return (
    <div data-test-id={id}>
      <CheckboxField
        className={classes.root}
        checkboxClassName={classes.checkbox}
        name={id}
        checked={isActive}
        onChange={handleChange}
        label={<div className={classes.label}>{label}</div>}
      />
    </div>
  );
};

export default memo(ValueCheckbox);
