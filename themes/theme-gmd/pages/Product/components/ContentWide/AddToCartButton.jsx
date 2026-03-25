import React, {
  useState, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import { DIRECT_SHIP } from '@shopgate/engage/locations';
import { i18n } from '@shopgate/engage/core/helpers';
import { Ripple } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Icon from '../Header/components/CTAButtons/components/CartButton/components/Icon';
import inject from './AddToCartButton.injector';
import connect from './AddToCartButton.connector';

const { colors, variables } = themeConfig;

const useStyles = makeStyles()({
  button: {
    cursor: 'pointer',
    background: 'var(--color-button-cta)',
    color: 'var(--color-button-cta-contrast)',
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 5,
    outline: 0,
    textAlign: 'center',
    transition: 'width 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    margin: '16px 0px 16px 16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: `${(variables.gap.big * 0.75)}px ${variables.gap.big * 0.6}px ${(variables.gap.big * 0.75)}px`,
  },
  disabled: {
    background: colors.shade5,
    color: colors.light,
    cursor: 'not-allowed',
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 5,
    outline: 0,
    textAlign: 'center',
    transition: 'width 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    margin: '16px 0px 16px 16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: `${(variables.gap.big * 0.75)}px ${variables.gap.big * 0.6}px ${(variables.gap.big * 0.75)}px`,
  },
  icon: {
    height: 32,
    marginTop: -24,
    marginRight: -24,
    '& svg': {
      fill: 'var(--color-button-cta-contrast)',
    },
  },
  iconDisabled: {
    '& svg': {
      fill: '#fff',
    },
  },
});

/**
 * Wide layout add-to-cart control on the product page.
 * @param {Object} props Component props from connector and injector.
 * @returns {JSX.Element}
 */
const AddToCartButton = ({
  addToCart,
  conditioner,
  disabled,
  loading,
  options,
  productId,
  quantity,
  isRopeFulfillmentMethodAllowed,
  userLocation,
  userMethod,
}) => {
  const { classes } = useStyles();
  const [success, setSuccess] = useState(false);
  const lockedRef = useRef(false);

  const runAddToCart = useCallback(() => {
    conditioner.check().then((fulfilled) => {
      if (!fulfilled) {
        return;
      }

      setSuccess(true);

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
    addToCart,
    conditioner,
    isRopeFulfillmentMethodAllowed,
    options,
    productId,
    quantity,
    userLocation,
    userMethod,
  ]);

  const handleClick = useCallback(async () => {
    if (lockedRef.current || disabled || loading) {
      return;
    }

    lockedRef.current = true;
    await runAddToCart();
    setTimeout(() => {
      lockedRef.current = false;
    }, 0);
  }, [disabled, loading, runAddToCart]);

  const handleIconSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  return (
    <Ripple
      fill
      className={disabled ? classes.disabled : classes.button}
      onClick={handleClick}
      disabled={disabled}
      data-test-id="addToCartBarButton"
      aria-label={i18n.text('product.add_to_cart')}
      type="button"
    >
      <I18n.Text string="product.add_to_cart" />
      <div className={classNames(classes.icon, {
        [classes.iconDisabled]: disabled,
      })}
      >
        <Icon
          disabled={disabled}
          success={success}
          onSuccess={handleIconSuccess}
        />
      </div>
    </Ripple>
  );
};

AddToCartButton.propTypes = {
  addToCart: PropTypes.func.isRequired,
  conditioner: PropTypes.shape().isRequired,
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  options: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  isRopeFulfillmentMethodAllowed: PropTypes.bool,
  userLocation: PropTypes.shape(),
  userMethod: PropTypes.string,
};

AddToCartButton.defaultProps = {
  isRopeFulfillmentMethodAllowed: false,
  userLocation: null,
  userMethod: '',
};

export default inject(connect(AddToCartButton));
