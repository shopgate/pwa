import React, { useMemo } from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { themeConfig } from '@shopgate/engage';
import { svgToDataUrl } from '@shopgate/engage/core/helpers';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig as commonThemeConfig } from '@shopgate/pwa-common/helpers/config';
import Icon from './components/Icon';

const { variables } = commonThemeConfig;
const { svgImages = {} } = themeConfig || {};
const { emptyCart = '' } = svgImages || {};

const useStyles = makeStyles()({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    height: '100%',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: '1',
    flexShrink: '0',
  },
  icon: {
    width: variables.emptyPage.icon,
  },
  title: {
    textAlign: 'center',
    paddingTop: variables.emptyPage.titleTopGap,
  },
});

/**
 * The Cart Empty component.
 * @return {JSX.Element}
 */
const Empty = () => {
  const { classes } = useStyles();
  const imageSRC = useMemo(() => svgToDataUrl(emptyCart), []);

  return (
    <div className={classes.wrapper}>
      <Portal name={portals.CART_EMPTY_BEFORE} />
      <Portal name={portals.CART_EMPTY}>
        <div className={classes.container}>
          <div className={classNames(classes.icon, 'empty-cart__image')}>
            {emptyCart ? <img src={imageSRC} alt="" /> : <Icon />}
          </div>
          <div className={classes.title} data-test-id="emptyCartPlaceHolderString">
            <I18n.Text string="cart.empty" />
          </div>
        </div>
      </Portal>
      <Portal name={portals.CART_EMPTY_AFTER} />
    </div>
  );
};

export default Empty;
