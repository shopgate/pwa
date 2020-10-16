import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { DIRECT_SHIP } from '@shopgate/engage/locations';
import { Ripple } from '@shopgate/engage/components';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import Icon from '../Header/components/CTAButtons/components/CartButton/components/Icon';
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
    userMethod: PropTypes.string,
  }

  static defaultProps = {
    isRopeFulfillmentMethodAllowed: false,
    userLocation: null,
    userMethod: '',
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
      success: false,
    };
  }

  addToCart = () => {
    const {
      conditioner,
      productId,
      quantity,
      options,
      userLocation,
      userMethod,
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
        params: { count: this.context.quantity },
      });
    });
  }

  /**
   * Adds a new product to cart or opens the cart if it already has products in it.
   */
  handleClick = async () => {
    const {
      disabled,
      loading,
    } = this.props;

    if (this.locked || disabled || loading) {
      return;
    }

    this.locked = true;
    await this.addToCart();
    setTimeout(() => {
      this.locked = false;
    }, 0);
    this.setState({ success: true });
  }

  /**
   * Renders the animated tick.
   * @returns {JSX}
   */
  renderIcon() {
    return (
      <div className={styles.icon}>
        <Icon
          disabled={this.props.disabled}
          success={this.state.success}
          onSuccess={() => { this.setState({ success: false }); }}
        />
      </div>
    );
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { disabled } = this.props;
    const { __ } = this.context.i18n();
    const style = this.state.opened ? { width: '40%' } : null;
    const className = disabled ? styles.disabled.toString() : styles.button.toString();

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
        {this.renderIcon()}
      </Ripple>
    );
  }
}

export default inject(connect(AddToCartButton));
