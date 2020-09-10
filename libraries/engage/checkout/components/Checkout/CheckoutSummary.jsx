import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import TimeIcon from '@shopgate/pwa-ui-shared/icons/TimeIcon';
import moment from 'moment';
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
  card: css({
    marginTop: 8,
  }).toString(),
  time: css({
    marginBottom: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }).toString(),
  timeText: css({
    marginLeft: 8,
  }),
};

/**
 * Billing
 * @returns {JSX}
 */
const Billing = () => {
  const { taxLines, fulfillmentSlot } = useCheckoutContext();

  const content = React.useMemo(() => taxLines
    .filter(t => t.visible)
    .map(t => ({
      label: i18n.text(`checkout.summary.${t.type}`),
      text: i18n.price(t.value, t.currencyCode, 2),
    })), [taxLines]);

  return (
    <div className={styles.root}>
      <Section className={styles.card} title="checkout.summary.headline" content={content}>
        {fulfillmentSlot ? (
          <div className={styles.time}>
            <TimeIcon size={20} />
            <span className={styles.timeText}>
              {moment(fulfillmentSlot?.date, 'YYYY-MM-DD').format('ll')}
              {' '}
              {moment(fulfillmentSlot?.from, 'HH:mm').format('LT')}
              {' - '}
              {moment(fulfillmentSlot?.to, 'HH:mm').format('LT')}
            </span>
          </div>
        ) : null}
      </Section>
    </div>
  );
};

export default Billing;
