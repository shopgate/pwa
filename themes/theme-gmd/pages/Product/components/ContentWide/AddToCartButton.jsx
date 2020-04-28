import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { DIRECT_SHIP } from '@shopgate/engage/locations';
import { Ripple } from '@shopgate/engage/components';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import styles from './AddToCartButton.style';
import inject from './AddToCartButton.injector';
import connect from './AddToCartButton.connector';

/**
 * The AddToCartButton component.
 */
class AddToCartButton extends PureComponent {
  static propTypes = {
    addToCart: PropTypes.func.isRequired,
    conditioner: PropTypes.shape().isRequired,
    disabled: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    options: PropTypes.shape().isRequired,
    productId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    isRopeFulfillmentMethodAllowed: PropTypes.bool,
    userLocation: PropTypes.shape(),
  }

  static defaultProps = {
    isRopeFulfillmentMethodAllowed: false,
    userLocation: null,
  }

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.locked = false;
    this.state = {
      opened: false,
    };
  }

  addToCart = () => {
    const {
      conditioner,
      productId,
      quantity,
      options,
      userLocation,
      isRopeFulfillmentMethodAllowed,
      addToCart,
    } = this.props;

    conditioner.check().then((fulfilled) => {
      if (!fulfilled) {
        return;
      }

      const addToCartData = {
        productId,
        options,
        quantity,
      };

      // Add the user location for ROPIS if it is set.
      if (
        userLocation !== null
        && userLocation.fulfillmentMethod !== DIRECT_SHIP
        && isRopeFulfillmentMethodAllowed
      ) {
        addToCartData.fulfillment = {
          method: userLocation.fulfillmentMethod,
          location: {
            code: userLocation.code,
            name: userLocation.name,
          },
        };
      }

      addToCart(addToCartData);

      broadcastLiveMessage('product.adding_item', {
        params: { count: this.context.quantity },
      });
    });
  }

  /**
   * Adds a new product to cart or opens the cart if it already has products in it.
   */
  handleClick = () => {
    const {
      disabled,
      loading,
    } = this.props;

    console.warn('foo', this.locked, disabled, loading);
    if (this.locked || disabled || loading) {
      return;
    }

    this.locked = true;
    this.addToCart();
    setTimeout(() => {
      this.locked = false;
    }, 0);
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { disabled } = this.props;
    const { __ } = this.context.i18n();
    const style = this.state.opened ? { width: '40%' } : null;
    const className = disabled ? styles.disabled : styles.button;

    return (
      <Ripple
        fill
        className={className}
        style={style}
        onClick={this.handleClick}
        disabled={disabled}
        data-test-id="addToCartBarButton"
        aria-label={__('product.add_to_cart')}
        type="button"
      >
        <I18n.Text string="product.add_to_cart" />
      </Ripple>
    );
  }
}

export default inject(connect(AddToCartButton));
