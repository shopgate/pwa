import React, {
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { isIOSTheme } from '@shopgate/engage/core';
import { getPaymentMethods } from '../selectors/payment';
import { getCheckoutOrder } from '../selectors/order';
import CheckoutContext from '../providers/CheckoutProvider.context';
import { updateCheckoutOrder } from '../actions/updateCheckoutOrder';
import { fetchCheckoutOrder } from '../actions/fetchCheckoutOrder';
import { i18n } from '../../core/helpers/i18n';
import Context from './context';

import paypal from './paypal';
import stripe from './stripe';

const AVAILABLE_PAYMENT_METHOD = [paypal, stripe];

/**
 * Maps state to props
 * @param {Object} state State
 * @returns {Object}
 */
const mapStateToProps = state => ({
  order: getCheckoutOrder(state),
  paymentMethods: getPaymentMethods(state),
});
/**
 * Dispatch
 * @param {Object} dispatch Dispatch
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  updateOrder: order => dispatch(updateCheckoutOrder(order)),
  fetchOrder: () => dispatch(fetchCheckoutOrder()),
});

const { colors, variables } = themeConfig;

const styles = {
  headline: css({
    color: colors.shade3,
    fontSize: '1.25rem',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    margin: `0 0 ${variables.gap.small}px 0`,
    marginLeft: 16,
    marginRight: 8,
    ...(!isIOSTheme() ? {
      color: 'var(--color-text-high-emphasis)',
      textTransform: 'none',
    } : {}),
  }).toString(),
  section: css({
    marginBottom: 0,
    marginTop: 4,
    ...(isIOSTheme() ? {
      marginBottom: 32,
    } : {}),
  }).toString(),
  buttons: css({
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'row',
    ...(isIOSTheme() ? {
      marginBottom: 32,
    } : {}),
  }).toString(),
};

/**
 * PaymentMethodProvider
 * @param {Object} props Props
 * @returns {JSX}
 */
const PaymentMethodProvider = ({
  order,
  paymentMethods,
  fetchOrder,
  updateOrder,
}) => {
  const [activePaymentMeta, setActivePaymentMeta] = useState(null);
  const {
    setPaymentHandler, setPaymentData, needsPayment, setButtonLocked, setLocked,
  } = useContext(CheckoutContext);
  const paymentMethodRef = useRef();

  // Set active payment method to the orders first transaction.
  const paymentMethodCode = useMemo(() => {
    const transaction = order.paymentTransactions?.[0];
    if (!transaction) return null;
    return transaction.paymentMethod.code;
  }, [order]);

  const paymentData = useMemo(
    () => paymentMethods?.find(p => p.code === paymentMethodCode),
    [paymentMethodCode, paymentMethods]
  );

  const paymentImpl = useMemo(
    () => AVAILABLE_PAYMENT_METHOD.find(method =>
      method.code === paymentData
        ?.paymentProvider
        ?.code),
    [paymentData]
  );

  // Global transaction handler
  // Currently simply redirect fulfill request to the active payment method.
  useEffect(() => {
    setPaymentHandler({
      getCustomPayButton: () => paymentImpl?.payButton,
      fulfillTransaction: async ({ paymentTransactions }) => {
        const resolved = await paymentMethodRef.current.fulfillTransaction({ paymentTransactions });
        return resolved;
      },
    });
  }, [paymentImpl, setButtonLocked, setPaymentHandler]);

  // Map configured payment methods
  const availablePaymentMethods = useMemo(
    () => paymentMethods.map(method => ({
      ...AVAILABLE_PAYMENT_METHOD.find(m => m.code === method.paymentProvider.code),
      internalCode: method.code,
      settings: method.settings,
    })),
    [paymentMethods]
  );

  // Change payment method.
  const handleChangePayment = useCallback(async (code, meta = null) => {
    if (paymentMethodCode === code) {
      setActivePaymentMeta(meta);
      setPaymentData({ meta });
      return;
    }
    setLocked(true);
    await updateOrder({
      paymentTransactions: [{
        paymentMethod: {
          code,
        },
      }],
    });
    await fetchOrder();
    setActivePaymentMeta(meta);
    setPaymentData({ meta });
    setLocked(false);
  }, [setPaymentData, paymentMethodCode, setLocked, updateOrder, fetchOrder]);

  // API for the underlying payment methods.
  const paymentMethodApi = useMemo(() => ({
    registerPaymentMethod: (api) => {
      setButtonLocked(false);
      paymentMethodRef.current = api;
    },
  }), [setButtonLocked]);

  // Ignore for ROPIS.
  if (!needsPayment) {
    return null;
  }

  // Render the respective payment method provider.
  const { provider: Provider, content: Content } = paymentImpl || {};
  return (
    <Context.Provider value={paymentMethodApi}>
      <div className={styles.section}>
        <h3 className={styles.headline}>
          {i18n.text('checkout.payment.title')}
        </h3>
        <div className={styles.buttons}>
          {availablePaymentMethods.map(method => (
            <method.button
              key={method.internalCode}
              settings={method.settings}
              onChange={meta => handleChangePayment(method.internalCode, meta)}
              active={method.internalCode === paymentMethodCode}
              activePaymentMeta={activePaymentMeta}
            />
          ))}
        </div>
        {paymentImpl ? (
          <Provider
            context={Context}
            data={paymentData}
            activePaymentMeta={activePaymentMeta}
          >
            <Content />
          </Provider>
        ) : null}
      </div>
    </Context.Provider>
  );
};

PaymentMethodProvider.propTypes = {
  fetchOrder: PropTypes.func.isRequired,
  updateOrder: PropTypes.func.isRequired,
  order: PropTypes.shape(),
  paymentMethods: PropTypes.arrayOf(PropTypes.shape()),
};
PaymentMethodProvider.defaultProps = {
  order: null,
  paymentMethods: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  PaymentMethodProvider
);
