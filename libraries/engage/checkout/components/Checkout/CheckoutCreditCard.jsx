import React from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import { isIOSTheme, i18n } from '@shopgate/engage/core';
import { TextField } from '@shopgate/engage/components';
import { getCSSCustomProp } from '@shopgate/engage/styles';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import Section from './CheckoutSection';
import { useStripeContext, useCheckoutContext } from '../../hooks/common';

const { colors } = themeConfig;

const styles = {
  root: css({
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
    ' .formElement': {
      ...(!isIOSTheme() ? {
        background: `var(--color-background-accent, ${colors.shade8})`,
        padding: 0,
        marginBottom: 38,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottom: `1px solid ${colors.shade12}`,
      } : {}),
    },
    ' .formElement label': {
      ...(!isIOSTheme() ? {
        color: 'var(--color-text-low-emphasis)',
        paddingLeft: 24,
      } : {}),
    },
    ' .underline': {
      ...(!isIOSTheme() ? {
        marginBottom: 0,
        borderBottom: 'none',
      } : {}),
    },
    ' .errorText': {
      ...(!isIOSTheme() ? {
        bottom: -20,
        left: 18,
      } : {}),
    },
    ' .StripeElement': {
      ...(!isIOSTheme() ? {
        paddingLeft: 16,
      } : {}),
    },
  }).toString(),
  secondRow: css({
    display: 'flex',
    flexDirection: 'row',
  }).toString(),
  cvc: css({
    flex: 1.5,
    marginRight: 16,
  }).toString(),
  expiry: css({
    flex: 1,
  }).toString(),
};

/* eslint-disable react/prop-types */
/**
 * Wrapper
 * @param {Object} Element element
 * @returns {Object}
 */
const wrapStripeElement = Element => class extends React.Component {
  onChange = () => {
    this.props.onChange({ target: { value: ' ' } });
  }

  /** Render
   * @returns {JSX} */
  render() {
    return <Element
      {...this.props}
      onChange={this.onChange}
    />;
  }
};
/* eslint-enable react/prop-types */

const StripeCardNumberElement = wrapStripeElement(CardNumberElement);
const StripeCardCvcElement = wrapStripeElement(CardCvcElement);
const StripeCardExpiryElement = wrapStripeElement(CardExpiryElement);

/**
 * PickupContactForm
 * @returns {JSX}
 */
const Billing = () => {
  const cardRef = React.useRef();
  const { error, setError } = useStripeContext();
  const { needsPayment } = useCheckoutContext();

  // Scrolls to stripe config when error is set.
  React.useEffect(() => {
    if (!error) return;
    cardRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [error]);

  if (!needsPayment) {
    return null;
  }

  const textFieldStyles = {
    style: {
      base: {
        color: getCSSCustomProp('--color-text-high-emphasis'),
        '::placeholder': {
          color: getCSSCustomProp('--color-text-low-emphasis'),
        },
      },
    },
  };

  return (
    <div ref={cardRef} className={styles.root}>
      <Section title="checkout.creditCard.headline" hasForm>
        <TextField
          label={i18n.text('checkout.creditCard.card')}
          name="creditCard"
          inputComponent={StripeCardNumberElement}
          isControlled={false}
          value=" "
          errorText={error || undefined}
          onChange={() => error && setError(null)}
          variables
          attributes={{
            options: {
              showIcon: true,
              ...textFieldStyles,
            },
          }}
        />
        <div className={styles.secondRow}>
          <TextField
            className={styles.cvc}
            label={i18n.text('checkout.creditCard.cvc')}
            name="creditCard"
            inputComponent={StripeCardCvcElement}
            isControlled={false}
            onChange={() => error && setError(null)}
            value=" "
            attributes={{
              options: {
                ...textFieldStyles,
              },
            }}
          />
          <TextField
            className={styles.expiry}
            label={i18n.text('checkout.creditCard.expiry')}
            name="creditCard"
            inputComponent={StripeCardExpiryElement}
            isControlled={false}
            onChange={() => error && setError(null)}
            value=" "
            attributes={{
              options: {
                ...textFieldStyles,
              },
            }}
          />
        </div>
      </Section>
    </div>
  );
};

export default Billing;
