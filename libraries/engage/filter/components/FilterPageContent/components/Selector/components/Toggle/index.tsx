import { memo } from 'react';
import type { ReactNode } from 'react';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  toggle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    flex: 1,
    minWidth: 0,
  },
  label: {
    ...theme.typography.body1,
    textAlign: 'left',
  },
}));

export interface ToggleProps {
  /**
   * The filter label.
   */
  label: ReactNode;
  /**
   * The selected values element rendered below the label.
   */
  selected?: ReactNode;
}

/**
 * Renders the filter label and its selected values in the accordion header.
 * @returns The rendered component.
 */
const Toggle = ({ label, selected = null }: ToggleProps) => {
  const { classes, cx } = useStyles();

  return (
    <div className={classes.toggle}>
      <span className={cx(classes.label, 'filter-selector-toggle-label')}>
        {label}
      </span>
      {selected}
    </div>
  );
};

export default memo(Toggle);
