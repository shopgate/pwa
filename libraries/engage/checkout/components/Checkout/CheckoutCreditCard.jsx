import React from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import {
  CardElement,
} from '@stripe/react-stripe-js';
import Section from './CheckoutSection';
import { useStripeContext } from '../../hooks/common';

const { colors, variables } = themeConfig;

const styles = {
  root: css({
    padding: 16,
    position: 'relative',
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
  }).toString(),
  card: css({
    padding: variables.gap.small,
    margin: '5px 0 12px 0',
  }).toString(),
  error: css({
    color: colors.error,
    fontSize: 12,
    position: 'absolute',
    bottom: 6,
  }),
};

/**
 * PickupContactForm
 * @returns {JSX}
 */
const Billing = () => {
  const cardRef = React.useRef();
  const { error, setError } = useStripeContext();

  // Scrolls to stripe config when error is set.
  React.useEffect(() => {
    if (!error) return;
    cardRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [error]);

  return (
    <div className={styles.root}>
      <Section className={styles.card} title="checkout.creditCard.headline">
        <CardElement onChange={() => error && setError(null)} />
      </Section>
      {error ? (
        <span className={styles.error}>
          {error}
        </span>
      ) : null}
    </div>
  );
};

export default Billing;
