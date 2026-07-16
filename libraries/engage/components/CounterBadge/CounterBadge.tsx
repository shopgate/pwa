import { makeStyles } from '@shopgate/engage/styles';
import { Typography } from '../Typography';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.components.counterBadge.background,
    color: theme.contrastColor(theme.components.counterBadge.background),
    borderRadius: theme.spacing(1),
    height: theme.spacing(2),
    minWidth: theme.spacing(2),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
}));

export interface CounterBadgeProps {
  /**
   * The number to display. The badge renders nothing when this is 0.
   */
  count: number;
  /**
   * Counts above this are displayed as `{max}+`.
   */
  max?: number;
  /**
   * Additional CSS classes. Callers own the badge's positioning.
   */
  className?: string;
  /**
   * Inline style overrides.
   */
  style?: React.CSSProperties;
  /**
   * Renders an empty bubble when false, to indicate state without a number.
   */
  showCount?: boolean;
  [key: `data-${string}`]: string;
}

/**
 * A counter bubble used to display item counts on icons, e.g. within the tab bar or app bar.
 * @param props The component props.
 * @param props.count The number to display.
 * @param props.max Counts above this are displayed as `{max}+`.
 * @param props.className Additional CSS classes.
 * @param props.style Inline style overrides.
 * @param props.showCount Whether the number is rendered inside the bubble.
 * @returns The rendered component.
 */
const CounterBadge = ({
  count,
  max,
  className,
  style,
  showCount = true,
  ...restProps
}: CounterBadgeProps) => {
  const { classes, cx } = useStyles();

  if (!count) {
    return null;
  }

  const label = max !== undefined && count > max ? `${max}+` : `${count}`;

  return (
    <Typography
      variant="caption"
      component="div"
      fontWeight="bold"
      style={style}
      className={cx(classes.root, className, 'theme__badge')}
      {...restProps}
    >
      {showCount ? label : ''}
    </Typography>
  );
};

export default CounterBadge;
