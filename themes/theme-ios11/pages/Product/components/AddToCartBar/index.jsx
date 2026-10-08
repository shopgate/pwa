import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { RouteContext } from '@shopgate/pwa-common/context';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import { FooterBar, SurroundPortals } from '@shopgate/engage/components';
import {
  PRODUCT_ADD_TO_CART_BAR,
  PRODUCT_ADD_TO_CART_BAR_QUANTITY_PICKER,
} from '@shopgate/engage/product/constants';
import { QuantityStepper } from '@shopgate/engage/product/components';
import { getProductStock } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getProductAddToCartBarSettings } from '@shopgate/engage/settings/selectors/appSettings';
import { broadcastLiveMessage, Section } from '@shopgate/engage/a11y';
import { DIRECT_SHIP } from '@shopgate/engage/locations';
import { ProductContext } from '@shopgate/engage/product/contexts';
import { makeStyles } from '@shopgate/engage/styles';
import { useAddToCartFeedback } from '@shopgate/engage/product/hooks/useAddToCartFeedback';
import { useFooterBarLayout } from '../../../../components/TabBar/hooks';
import * as constants from './constants';
import AddToCartButton from './components/AddToCartButton';
import connect from './connector';

const MAX_QUANTITY = 99;

const useStyles = makeStyles()(theme => ({
  base: {
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
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
  const { classes, cx } = useStyles();
  const productCtx = useContext(ProductContext);
  const busy = useRef(false);
  const { state: addState, track } = useAddToCartFeedback();
  const {
    variant: configuredVariant,
    quantityPicker,
  } = useSelector(getProductAddToCartBarSettings);
  const layout = useFooterBarLayout(configuredVariant);
  const stock = useSelector(state => getProductStock(state, { productId }));
  const minQuantity = stock?.minOrderQuantity > 0 ? stock.minOrderQuantity : 1;
  const maxQuantity = stock?.maxOrderQuantity > 0
    ? Math.min(stock.maxOrderQuantity, MAX_QUANTITY)
    : MAX_QUANTITY;

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

  const { quantity: contextQuantity, setQuantity } = productCtx;
  const quantity = quantityPicker
    ? Math.min(Math.max(contextQuantity, minQuantity), maxQuantity)
    : contextQuantity;

  useEffect(() => {
    if (quantityPicker && contextQuantity !== quantity) {
      setQuantity(quantity);
    }
  }, [contextQuantity, quantity, quantityPicker, setQuantity]);

  const hadQuantityPicker = useRef(quantityPicker);

  useEffect(() => {
    if (hadQuantityPicker.current && !quantityPicker) {
      setQuantity(1);
    }
    hadQuantityPicker.current = quantityPicker;
  }, [quantityPicker, setQuantity]);

  const resetClicked = useCallback(() => setClicked(false), []);

  const handleAddToCart = useCallback(() => {
    if (busy.current || clicked || loading || disabled || addState !== 'idle') {
      return;
    }

    busy.current = true;

    const release = () => {
      busy.current = false;
    };

    conditioner.check().then((fulfilled) => {
      if (!fulfilled) {
        release();
        return undefined;
      }

      setClicked(true);

      const addToCartData = {
        productId,
        options,
        quantity,
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

      broadcastLiveMessage('product.adding_item', {
        params: { count: quantity },
      });

      setTimeout(resetClicked, 250);

      return track(addToCart(addToCartData), () => {
        broadcastLiveMessage('product.item_added', {
          params: { count: quantity },
        });
      });
    }).then(release, release);
  }, [
    clicked, loading, disabled, addState, conditioner, quantity,
    productId, options, userLocation, userMethod, isRopeFulfillmentMethodAllowed, addToCart,
    resetClicked, track,
  ]);

  if (barVisible === false || !routeVisible) {
    return null;
  }

  return (
    (
      <FooterBar variant={layout.variant} gap={layout.gap}>
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
            quantity,
            setQuantity,
          }}
        >
          <Section
            title="product.sections.purchase"
            className={cx(classes.base, 'theme__product__add-to-cart-bar')}
            data-variant={layout.variant}
          >
            {quantityPicker && (
              <SurroundPortals
                portalName={PRODUCT_ADD_TO_CART_BAR_QUANTITY_PICKER}
                portalProps={{
                  productId,
                  quantity,
                  setQuantity,
                  minQuantity,
                  maxQuantity,
                }}
              >
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  min={minQuantity}
                  max={maxQuantity}
                  disabled={disabled}
                />
              </SurroundPortals>
            )}
            <AddToCartButton
              disabled={disabled && addState === 'idle'}
              state={addState}
              onClick={handleAddToCart}
            />
          </Section>
        </SurroundPortals>
      </FooterBar>
    )
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
