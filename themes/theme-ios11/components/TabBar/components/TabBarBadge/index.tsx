import { Badge } from '@shopgate/engage/components';
import type { BadgeProps } from '@shopgate/engage/components/Badge';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'absolute',
    borderRadius: theme.components.tabBar.badgeBorderRadius,
    top: theme.components.tabBar.badgeTop,
    transform: 'translateX(-50%)',
    left: theme.components.tabBar.badgeLeft,
  },
}));

/**
 * The props of a tab badge.
 */
type Props = Pick<BadgeProps, 'count' | 'max' | 'showCount' | 'className'>;

/**
 * A badge in the position of the tab bar badges, on the icon of a tab.
 * @param props The component props.
 * @param props.className Classes after the position class, e.g. the stable class of the tab.
 * @returns The badge, or nothing while the count is 0.
 */
const TabBarBadge = ({ className, ...badgeProps }: Props) => {
  const { classes, cx } = useStyles();

  return <Badge {...badgeProps} className={cx(classes.root, className)} />;
};

export default TabBarBadge;
