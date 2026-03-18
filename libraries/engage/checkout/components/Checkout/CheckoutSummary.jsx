import React, { useMemo } from 'react';
import { i18n } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import TimeIcon from '@shopgate/pwa-ui-shared/icons/TimeIcon';
import moment from 'moment';
import Section from './CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';

const useStyles = makeStyles()({
  root: {
    padding: 16,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
  },
  card: {
    marginTop: 8,
  },
  time: {
    marginBottom: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 8,
  },
});

/**
 * Billing
 * @returns {JSX}
 */
const Billing = () => {
  const { classes } = useStyles();
  const { taxLines, fulfillmentSlot } = useCheckoutContext();

  const content = useMemo(() => taxLines
    .filter(t => t.visible)
    .map((t) => {
      let text = null;

      if (t.value !== null) {
        if (t.type === 'shippingTotal' && t.value === 0) {
          text = i18n.text('shipping.free_short');
        } else {
          text = i18n.price(t.value, t.currencyCode, 2);
        }
      }

      return {
        label: t.label === null ? i18n.text(`checkout.summary.${t.type}`) : t.label,
        text,
        info: t.info || null,
        messages: t.messages || null,
      };
    }), [taxLines]);

  return (
    <div className={classes.root}>
      <Section className={classes.card} title="checkout.summary.headline" content={content}>
        {fulfillmentSlot ? (
          <div className={classes.time}>
            <TimeIcon size={20} />
            <span className={classes.timeText}>
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
