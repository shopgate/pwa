import React, {
  useState, useContext, useCallback, useMemo, memo,
} from 'react';
import PropTypes from 'prop-types';
import { FloatingActionButton } from '@shopgate/pwa-ui-material';
import IndicatorCircle from '@shopgate/pwa-ui-shared/IndicatorCircle';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import { I18n } from '@shopgate/engage/components';
import { makeStyles, cx } from '@shopgate/engage/styles';
import { ProductContext } from '@shopgate/engage/product/contexts';
import { DIRECT_SHIP } from '@shopgate/engage/locations';
import Icon from './components/Icon';
import connect from './connector';
import inject from './injector';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  button: {
    transition: 'background 400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
  hidden: {
    clip: 'rect(1px, 1px, 1px, 1px)',
    height: '1px',
    margin: 0,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
    zIndex: -1000,
  },
});

/**
 * The CartButton component.
 * @param {Object} props Props from connector and injector.
 * @returns {JSX.Element}
 */
const CartButton = ({
  addToCart,
  conditioner,
  disabled,
  loading,
  options,
  productId,
  isRopeFulfillmentMethodAllowed,
  userLocation,
  userMethod,
}) => {
  const { classes } = useStyles();
  const { quantity } = useContext(ProductContext);
  const [clicked, setClicked] = useState(false);

  const color = useMemo(() => {
    if (clicked) {
      return 'var(--color-button-cta-contrast)';
    }
    return (disabled && !loading) ? colors.shade5 : 'var(--color-button-cta)';
  }, [clicked, disabled, loading]);

  const resetClicked = useCallback(() => {
    setClicked(false);
  }, []);

  const icon = useMemo(() => {
    if (loading) {
      return (
        <IndicatorCircle
          color="var(--color-button-cta-contrast)"
          strokeWidth={4}
          paused={false}
        />
      );
    }

    return (
      <Icon
        disabled={disabled}
        success={clicked}
        onSuccess={resetClicked}
      />
    );
  }, [loading, disabled, clicked, resetClicked]);

  const handleClick = useCallback(() => {
    if (clicked || disabled) {
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

      addToCart(addToCartData);

      broadcastLiveMessage('product.adding_item', {
        params: { count: quantity },
      });
    });
  }, [
    clicked,
    disabled,
    conditioner,
    addToCart,
    productId,
    options,
    quantity,
    userLocation,
    userMethod,
    isRopeFulfillmentMethodAllowed,
  ]);

  return (
    <FloatingActionButton
      background={color}
      className={cx(classes.button, 'theme__product__header__cta-buttons__cart-button')}
      onClick={handleClick}
      disabled={disabled}
      testId="addToCartButton"
    >
      <I18n.Text string="product.add_to_cart" className={classes.hidden} />
      {icon}
    </FloatingActionButton>
  );
};

CartButton.propTypes = {
  addToCart: PropTypes.func.isRequired,
  conditioner: PropTypes.shape().isRequired,
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  options: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
  isRopeFulfillmentMethodAllowed: PropTypes.bool,
  userLocation: PropTypes.shape(),
  userMethod: PropTypes.string,
};

CartButton.defaultProps = {
  isRopeFulfillmentMethodAllowed: false,
  userLocation: null,
  userMethod: null,
};

export default inject(connect(memo(CartButton)));
