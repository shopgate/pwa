import { useSelector } from 'react-redux';
import { getHasBackInStockSubscriptions } from '@shopgate/engage/back-in-stock/selectors';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  badge: {
    background: theme.palette.primary.main,
    borderRadius: '50%',
    display: 'block',
    height: 8,
    position: 'absolute',
    right: 21,
    top: 23,
    width: 8,
  },
}));

/**
 * Renders the back in stock subscription indicator.
 * @returns The rendered badge.
 */
const BackInStockBadge = () => {
  const { classes, cx } = useStyles();
  const visible = useSelector(getHasBackInStockSubscriptions);

  if (!visible) {
    return null;
  }

  return (
    <span className={cx(classes.badge, 'theme__nav-drawer__back-in-stock-button-badge', 'theme__badge')} />
  );
};

export default BackInStockBadge;
