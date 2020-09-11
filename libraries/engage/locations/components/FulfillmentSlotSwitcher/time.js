import moment from 'moment';
import { i18n } from '@shopgate/engage/core';

/**
 * Creates a display string for the given slot.
 * @param {Object} fulfillmentSlot Slot
 * @returns {Object}
 */
export const getTimeSlotDisplayText = (fulfillmentSlot) => {
  if (!fulfillmentSlot || !fulfillmentSlot?.date || !fulfillmentSlot?.from) {
    return i18n.text('locations.your_current_timeslot.not_set');
  }

  const momentDate = moment(fulfillmentSlot.date, 'YYYY-MM-DD');
  const fromNow = momentDate.fromNow();
  const relativeString = momentDate.calendar(null, {
    sameDay: `[${i18n.text('locations.your_current_timeslot.today')}]`,
    nextDay: `[${i18n.text('locations.your_current_timeslot.tomorrow')}]`,
    nextWeek: 'dddd',
    sameElse() {
      return `[${fromNow}]`;
    },
  });

  const [fromHours, fromMinutes] = fulfillmentSlot.from.split(':').map(x => parseInt(x, 10));
  const from = moment().set({ hours: fromHours, minutes: fromMinutes });
  const [toHours, toMinutes] = fulfillmentSlot.to.split(':').map(x => parseInt(x, 10));
  const to = moment().set({ hours: toHours, minutes: toMinutes });

  return `${relativeString} ${from.format('LT')} - ${to.format('LT')}`;
};
