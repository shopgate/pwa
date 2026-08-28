import { memo } from 'react';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  chip: {
    ...theme.typography.body2,
    padding: theme.spacing(0.25, 1.25),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.secondary.main}`,
    overflowWrap: 'anywhere',
  },
}));

export interface SelectedValue {
  /**
   * Id of the filter value.
   */
  id: string;
  /**
   * Display label of the filter value.
   */
  label: string;
}

export interface SelectedProps {
  /**
   * The selected filter values, already ordered for display.
   */
  values: SelectedValue[];
}

/**
 * Renders the selected filter values as chips in the accordion header.
 * @returns The rendered component.
 */
const Selected = ({ values }: SelectedProps) => {
  const { classes } = useStyles();

  if (values.length === 0) {
    return null;
  }

  return (
    <div className={classes.chips}>
      {values.map(({ id, label }) => (
        <span key={id} className={classes.chip}>{label}</span>
      ))}
    </div>
  );
};

export default memo(Selected);
