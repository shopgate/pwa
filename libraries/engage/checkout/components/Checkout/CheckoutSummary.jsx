import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import Section from './CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';

const styles = {
  root: css({
    padding: 16,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
  }).toString(),
};

/**
 * Billing
 * @returns {JSX}
 */
const Billing = () => {
  const { taxLines } = useCheckoutContext();

  const content = React.useMemo(() => taxLines
    .filter(t => t.visible)
    .map(t => ({
      label: i18n.text(`checkout.summary.${t.type}`),
      text: i18n.price(t.value, t.currencyCode, 2),
    })), [taxLines]);

  return (
    <div className={styles.root}>
      <Section title="checkout.summary.headline" content={content} />
    </div>
  );
};

export default Billing;
