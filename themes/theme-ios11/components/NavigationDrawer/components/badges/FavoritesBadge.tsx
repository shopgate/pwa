import { useSelector } from 'react-redux';
import { getFavoritesCount } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { makeStyles } from '@shopgate/engage/styles';

const MAX_COUNT = 999;

const useStyles = makeStyles()((theme) => {
  const size = theme.spacing(2 * 1.125);
  return {
    badge: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: size,
      color: theme.palette.primary.contrastText,
      fontSize: 12,
      fontWeight: 700,
      height: size,
      minWidth: size,
      padding: theme.spacing(0, 0.625),
      position: 'absolute',
      right: 16,
      textAlign: 'center',
      top: 19,
    },
  };
});

/**
 * Renders the favorites item count badge.
 * @returns The rendered badge.
 */
const FavoritesBadge = () => {
  const { classes, cx } = useStyles();
  const count = useSelector(state => getFavoritesCount(state, { useItemQuantity: true }));

  if (!count) {
    return null;
  }

  return (
    <span className={cx(classes.badge, 'theme__nav-drawer__favorites-button-badge', 'theme__badge')}>
      {count > MAX_COUNT ? `${MAX_COUNT}+` : count}
    </span>
  );
};

export default FavoritesBadge;
