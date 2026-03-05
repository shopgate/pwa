import { makeStyles } from '@shopgate/engage/styles';
import { Typography } from '@shopgate/engage/components';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowColumn: {
    flexDirection: 'column',
  },
  subSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

/**
 * Layout component for sections in the theme demo page
 */
export const Section = ({
  title,
  children,
}: SectionProps) => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h2">{title}</Typography>
      {children}
    </div>
  );
};

interface SectionRowProps {
  children: React.ReactNode;
  renderColumn?: boolean;
  className?: string;
}

/**
 * Layout component for rows in the sections of the theme demo page
 */
export const SectionRow = ({ children, renderColumn, className }: SectionRowProps) => {
  const { classes, cx } = useStyles();
  return (
    <div className={cx(classes.row, { [classes.rowColumn]: renderColumn }, className)}>
      {children}
    </div>
  );
};

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Layout component for subsections in the sections of the theme demo page
 */
export const SubSection = ({ title, children }: SubSectionProps) => {
  const { classes } = useStyles();

  return (
    <div className={classes.subSection}>
      <Typography variant="h4">{title}</Typography>
      {children}
    </div>
  );
};
