import React, { useContext } from 'react';
import { themeConfig } from '@shopgate/engage';
import { i18n } from '@shopgate/engage/core/helpers';
import { TextField } from '@shopgate/engage/components';
import { getCSSCustomProp, makeStyles } from '@shopgate/engage/styles';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import Section from '../../components/Checkout/CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';
import StripeContext from './StripeProvider.context';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  root: {
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
    ' .formElement': {
      background: 'var(--color-background-accent)',
      padding: 0,
      marginBottom: 38,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      borderBottom: `1px solid ${colors.shade12}`,
    },
    ' .formElement label': {
      color: 'var(--color-text-low-emphasis)',
      paddingLeft: 24,
    },
    ' .underline': {
      marginBottom: 0,
      borderBottom: 'none',
    },
    ' .errorText': {
      bottom: -20,
      left: 18,
    },
    ' .StripeElement': {
      paddingLeft: 16,
    },
  },
  secondRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  cvc: {
    flex: 1.5,
    marginRight: 16,
  },
  expiry: {
    flex: 1,
  },
});

/* eslint-disable react/prop-types */
/**
 * Wrapper
 * @param {Object} Element element
 * @returns {Object}
 */
const wrapStripeElement = Element => class extends React.Component {
  onChange = () => {
    this.props.onChange({ target: { value: ' ' } });
  };

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
const StripeCreditCard = () => {
  const { classes } = useStyles();
  const cardRef = React.useRef();
  const { error, setError } = useContext(StripeContext);
  const { needsPayment, paymentData } = useCheckoutContext();

  // Scrolls to stripe config when error is set.
  React.useEffect(() => {
    if (!error) return;
    cardRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [error]);

  if (!needsPayment) {
    return null;
  }

  if (!!paymentData?.meta?.stripeRequest || !!paymentData?.meta) {
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
    <div ref={cardRef} className={classes.root}>
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
        <div className={classes.secondRow}>
          <TextField
            className={classes.cvc}
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
            className={classes.expiry}
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

export default StripeCreditCard;
