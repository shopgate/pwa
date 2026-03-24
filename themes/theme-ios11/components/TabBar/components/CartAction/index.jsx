import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { makeStyles } from '@shopgate/engage/styles';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import CartIcon from '@shopgate/pwa-ui-ios/icons/CartIcon';
import { i18n } from '@shopgate/engage/core';
import * as portals from '../../constants';
import TabBarAction from '../TabBarAction';
import CartItemBadge from './components/CartItemBadge';
import connect from '../connector';
import connectBadge from './components/CartItemBadge/connector';

const useIconStyles = makeStyles()({
  icon: {
    height: 24,
    width: 24,
  },
});

/**
 * The tab bar cart action.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const TabBarCartAction = (props) => {
  const { classes } = useIconStyles();
  const {
    cartProductCount,
    historyPush,
    label,
    ...tabBarActionProps
  } = props;

  const handleClick = useCallback(() => {
    historyPush({ pathname: CART_PATH });
  }, [historyPush]);

  const ariaLabel = useMemo(
    () => `${i18n.text(label)}. ${i18n.text('common.products')}: ${cartProductCount}.`,
    [cartProductCount, label]
  );

  return (
    <>
      <Portal name={portals.TAB_BAR_CART_BEFORE} props={props} />
      <Portal
        name={portals.TAB_BAR_CART}
        props={{
          ...props,
          TabBarAction,
        }}
      >
        <TabBarAction
          {...tabBarActionProps}
          aria-label={ariaLabel}
          icon={(
            <Portal name={portals.TAB_BAR_CART_ICON}>
              <CartIcon className={classes.icon} />
            </Portal>
          )}
          onClick={handleClick}
        >
          <CartItemBadge />
        </TabBarAction>
      </Portal>
      <Portal
        name={portals.TAB_BAR_CART_AFTER}
        props={{
          ...props,
          TabBarAction,
        }}
      />
    </>
  );
};

TabBarCartAction.propTypes = {
  cartProductCount: PropTypes.number.isRequired,
  historyPush: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  ...TabBarAction.propTypes,
};

TabBarCartAction.defaultProps = TabBarAction.defaultProps;

export default connect(connectBadge(memo(TabBarCartAction)));
