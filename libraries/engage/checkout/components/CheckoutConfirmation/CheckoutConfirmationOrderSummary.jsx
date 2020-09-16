import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import TimeIcon from '@shopgate/pwa-ui-shared/icons/TimeIcon';
import moment from 'moment';
import { i18n } from '../../../core/helpers/i18n';
import CheckoutConfirmationSection from './CheckoutConfirmationSection';
import { getCheckoutTaxLinesFromOrder } from '../../helpers';

const styles = {
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
 * CheckoutConfirmationOrderSummary component
 * @returns {JSX}
 */
const CheckoutConfirmationOrderSummary = ({ order, className }) => {
  const content = useMemo(() => getCheckoutTaxLinesFromOrder(order)
    .filter(t => t.visible)
    .map(t => ({
      label: t.label === null ? i18n.text(`checkout.summary.${t.type}`) : t.label,
      text: t.value !== null ? i18n.price(t.value, t.currencyCode, 2) : null,
    })), [order]);
  const fulfillmentSlot = order?.lineItems[0]?.fulfillmentSlot;

  return (
    <CheckoutConfirmationSection
      title="checkout.success.order_summary"
      content={content}
      isSummary
      className={className}
    >
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
    </CheckoutConfirmationSection>
  );
};

CheckoutConfirmationOrderSummary.propTypes = {
  order: PropTypes.shape().isRequired,
  className: PropTypes.string,
};

CheckoutConfirmationOrderSummary.defaultProps = {
  className: null,
};

export default CheckoutConfirmationOrderSummary;
