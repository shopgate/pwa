import { useCallback } from 'react';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import BurgerIcon from '@shopgate/pwa-ui-shared/icons/BurgerIcon';
import ShoppingCartIcon from '@shopgate/pwa-ui-shared/icons/ShoppingCartIcon';
import { i18n } from '@shopgate/engage/core/helpers';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { makeStyles } from '@shopgate/engage/styles';
import Logo from '../Logo';
import IconButton from '../v2/IconButton';
import { useThunkDispatch } from '../NavigationDrawer/hooks';
import { MAX_DESKTOP_WIDTH, DESKTOP_BAR_HEIGHT } from '../constants';

const useStyles = makeStyles()(theme => ({
  root: {
    background: theme.palette.background.surface,
    borderBottom: `1px solid ${theme.palette.background.emphasized}`,
    display: 'flex',
    height: DESKTOP_BAR_HEIGHT,
    justifyContent: 'center',
    width: '100%',
  },
  inner: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    gap: theme.spacing(1),
    maxWidth: MAX_DESKTOP_WIDTH,
    padding: theme.spacing(0, 2),
  },
  logo: {
    cursor: 'pointer',
    flexGrow: 0,
    ' img': {
      maxHeight: 42,
    },
  },
  spacer: {
    flexGrow: 1,
  },
}));

/**
 * The wide app bar shown in website mode above the `xs` breakpoint.
 * @returns The rendered bar.
 */
const WideBar = () => {
  const { classes, cx } = useStyles();
  const dispatch = useThunkDispatch();

  const goHome = useCallback(
    () => dispatch(historyPush({ pathname: INDEX_PATH })),
    [dispatch]
  );

  const goToCart = useCallback(
    () => dispatch(historyPush({ pathname: CART_PATH })),
    [dispatch]
  );

  return (
    <div className={cx(classes.root, 'engage__wide-bar')}>
      <div className={classes.inner}>
        <IconButton
          className="engage__wide-bar__menu-button"
          onClick={NavDrawer.open}
          aria-label={i18n.text('navigation.open_menu')}
          data-test-id="wideBarMenuButton"
        >
          <BurgerIcon />
        </IconButton>
        <Logo onClick={goHome} className={classes.logo} />
        <div className={classes.spacer} />
        <IconButton
          className="engage__wide-bar__cart-button"
          onClick={goToCart}
          aria-label={i18n.text('navigation.cart')}
          data-test-id="wideBarCartButton"
        >
          <ShoppingCartIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default WideBar;
