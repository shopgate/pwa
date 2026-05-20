import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { RouteContext } from '@shopgate/pwa-common/context';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  PRODUCT_ADD_TO_CART_BAR,
} from '@shopgate/engage/product/constants';
import { broadcastLiveMessage, Section } from '@shopgate/engage/a11y';
import { DIRECT_SHIP } from '@shopgate/engage/locations';
import { ProductContext } from '@shopgate/engage/product/contexts';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import * as constants from './constants';
import AddToCartButton from './components/AddToCartButton';
import AddMoreButton from './components/AddMoreButton';
import CartItemsCount from './components/CartItemsCount';
import connect from './connector';

const { colors, shadows } = themeConfig;
const barHeight = 46;

const useStyles = makeStyles()(theme => ({
  container: {
    background: colors.light,
    boxShadow: shadows.cart.paymentBar,
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden',
    paddingBottom: 'var(--safe-area-inset-bottom)',
  },
  innerContainer: {
    padding: theme.spacing(1),
  },
  base: {
    height: barHeight,
    position: 'relative',
  },
  statusBar: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    maxWidth: '60%',
    padding: theme.spacing(0, 1),
  },
}));

/**
 * Add to cart bar component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const AddToCartBar = (props) => {
  const {
    visible: routeVisible,
    ...restProps
  } = props;
  const {
    conditioner,
    options,
    productId,
    addToCart,
    disabled,
    isRopeFulfillmentMethodAllowed,
    loading,
    userLocation,
    userMethod,
  } = props;
  const { classes } = useStyles();
  const productCtx = useContext(ProductContext);
  const target = useRef(typeof document !== 'undefined' ? document.getElementById('AppFooter') : null);
  const innerRef = useRef(null);
  const moreButtonRef = useRef(null);

  const [clicked, setClicked] = useState(false);
  const [barVisible, setBarVisible] = useState(true);
  const [added, setAdded] = useState(0);

  const handleShow = useCallback(() => setBarVisible(true), []);
  const handleHide = useCallback(() => setBarVisible(false), []);
  const handleIncrement = useCallback((count) => {
    setAdded(prev => prev + count);
  }, []);
  const handleDecrement = useCallback((count) => {
    setAdded(prev => (prev > 0 ? prev - count : 0));
  }, []);
  const handleReset = useCallback(() => setAdded(0), []);

  useEffect(() => {
    UIEvents.addListener(constants.SHOW_ADD_TO_CART_BAR, handleShow);
    UIEvents.addListener(constants.HIDE_ADD_TO_CART_BAR, handleHide);
    UIEvents.addListener(constants.INCREMENT_ACTION_COUNT, handleIncrement);
    UIEvents.addListener(constants.DECREMENT_ACTION_COUNT, handleDecrement);
    UIEvents.addListener(constants.RESET_ACTION_COUNT, handleReset);
    return () => {
      UIEvents.removeListener(constants.SHOW_ADD_TO_CART_BAR, handleShow);
      UIEvents.removeListener(constants.HIDE_ADD_TO_CART_BAR, handleHide);
      UIEvents.removeListener(constants.INCREMENT_ACTION_COUNT, handleIncrement);
      UIEvents.removeListener(constants.DECREMENT_ACTION_COUNT, handleDecrement);
      UIEvents.removeListener(constants.RESET_ACTION_COUNT, handleReset);
    };
  }, [handleShow, handleHide, handleIncrement, handleDecrement, handleReset]);

  const resetClicked = useCallback(() => setClicked(false), []);

  const handleAddToCart = useCallback(() => {
    if (clicked || loading || disabled) {
      return;
    }

    conditioner.check().then((fulfilled) => {
      if (!fulfilled) {
        return;
      }

      setClicked(true);

      const addToCartData = {
        productId,
        options,
        quantity: productCtx.quantity,
      };

      if (
        userLocation !== null
        && userMethod !== DIRECT_SHIP
        && isRopeFulfillmentMethodAllowed
      ) {
        addToCartData.fulfillment = {
          method: userMethod,
          location: {
            code: userLocation.code,
            name: userLocation.name,
          },
        };
      }

      addToCart(addToCartData);

      broadcastLiveMessage('product.adding_item', {
        params: { count: productCtx.quantity },
      });

      if (moreButtonRef.current) {
        moreButtonRef.current.focus();
      }

      setTimeout(resetClicked, 250);
    });
  }, [
    clicked, loading, disabled, conditioner, productId, options, productCtx,
    userLocation, userMethod, isRopeFulfillmentMethodAllowed, addToCart, resetClicked,
  ]);

  if (barVisible === false || !routeVisible || !target.current) {
    return null;
  }

  return ReactDOM.createPortal(
    (
      <SurroundPortals
        portalName={PRODUCT_ADD_TO_CART_BAR}
        portalProps={{
          ...restProps,
          conditioner,
          options,
          productId,
          addToCart,
          disabled,
          isRopeFulfillmentMethodAllowed,
          loading,
          userLocation,
          userMethod,
          clicked,
          added,
          handleAddToCart,
          resetClicked,
          visible: barVisible,
        }}
      >
        <Section title="product.sections.purchase" className="theme__product__add-to-cart-bar">
          <div className={classes.container}>
            <div className={classes.innerContainer} ref={innerRef}>
              <div className={classes.base}>
                <div className={classes.statusBar}>
                  <CartItemsCount
                    productId={productId}
                    itemCount={added}
                  />
                  <AddMoreButton
                    handleAddToCart={handleAddToCart}
                    disabled={disabled}
                    loading={loading}
                    onReset={resetClicked}
                    visible={added > 0}
                    ref={moreButtonRef}
                  />
                </div>
                <AddToCartButton
                  disabled={disabled}
                  itemCount={added}
                  handleAddToCart={handleAddToCart}
                  onReset={resetClicked}
                />
              </div>
            </div>
          </div>
        </Section>
      </SurroundPortals>
    ),
    target.current
  );
};

AddToCartBar.propTypes = {
  conditioner: PropTypes.shape().isRequired,
  options: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  addToCart: PropTypes.func,
  disabled: PropTypes.bool,
  isRopeFulfillmentMethodAllowed: PropTypes.bool,
  loading: PropTypes.bool,
  userLocation: PropTypes.shape(),
  userMethod: PropTypes.string,
};

AddToCartBar.defaultProps = {
  addToCart: () => { },
  disabled: false,
  loading: false,
  isRopeFulfillmentMethodAllowed: false,
  userLocation: null,
  userMethod: null,
};

export default connect(props => (
  <RouteContext.Consumer>
    {({ visible }) => (
      <AddToCartBar {...props} visible={visible} />
    )}
  </RouteContext.Consumer>
));
