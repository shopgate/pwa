import { memo, useCallback } from 'react';
import type { ComponentType, ReactNode } from 'react';
import noop from 'lodash/noop';
import { Checkbox } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
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
    alignItems: 'flex-start',
    padding: theme.spacing(0.75, 0),
    '& .checkedIcon': {
      color: theme.palette.secondary.main,
    },
  },
  label: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      width: 'max-content',
      maxWidth: '100%',
    },
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
   * Number of products that are available for the filter value.
   */
  hits?: number;
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
  hits,
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
        label={(
          <div
            className={classes.label}
            aria-label={hits === undefined
              ? label
              : i18n.text('filter.hits', {
                label,
                count: hits,
              })}
          >
            <span>{label}</span>
            {hits !== undefined && <span>{`(${hits})`}</span>}
          </div>
        )}
      />
    </div>
  );
};

export default memo(ValueCheckbox);
