import React, {
  Fragment, useState, useMemo, useEffect, useCallback,
} from 'react';
import classnames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import groupBy from 'lodash/groupBy';
import { SheetDrawer, Button } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { makeGetFulfillmentSlotsForLocation, getPreferredLocation } from '../../selectors';
import fetchFulfillmentSlots from '../../actions/fetchFulfillmentSlots';

/**
 * Map state to propps.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getFulfillmentSlotsForLocation = makeGetFulfillmentSlotsForLocation(
    state => getPreferredLocation(state)?.code || null
  );
  return state => ({
    locationCode: getPreferredLocation(state)?.code,
    fulfillmentSlots: getFulfillmentSlotsForLocation(state),
  });
};

/**
 * Map dispatch to propps.
 * @param {Function} dispatch Dispatch
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  fetch: locationCode => dispatch(fetchFulfillmentSlots(locationCode)),
});

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
  }).toString(),
  title: css({
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 8,
  }).toString(),
  subtitle: css({
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  }).toString(),
  row: css({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -8,
    marginRight: -8,
  }).toString(),
  button: css({
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid var(--color-secondary)',
    borderRadius: 4,
    background: '#fff',
    transition: 'background, color 500ms',
    outline: 'none',
  }).toString(),
  buttonActive: css({
    color: '#fff',
    background: 'var(--color-secondary)',
  }).toString(),
  buttonDate: css({
    width: 124,
    height: 70,
    lineHeight: 1.3,
  }).toString(),
  buttonLabel: css({
    fontSize: 20,
    textAlign: 'center',
  }).toString(),
  buttonLabelSlot: css({
    padding: 2,
    fontSize: 16,
    textAlign: 'center',
  }).toString(),
  buttonDisabled: css({
    cursor: 'blocked',
    pointerEvents: 'none',
    border: '1px solid #444',
  }).toString(),
  buttonStrikethrough: css({
    position: 'absolute',
    background: '#444',
    left: 0,
    right: 0,
    height: 2,
    transform: 'rotate(-5deg)',
  }).toString(),
  buttonSchedule: css({
    marginTop: 32,
  }).toString(),
};

/**
 * Get Month day time.
 * @param {string} time Time
 * @return {string}
 */
const getMonthDay = (time) => {
  const momentTime = moment(time, 'YYYY-MM-DD');
  return momentTime.format('L').replace(new RegExp(`[^.]?${momentTime.format('YYYY')}.?`), '');
};

/**
 * Get Range for a time.
 * @param {string} from From
 * @param {string} to To
 * @return {string}
 */
const getRange = (from, to) => {
  const [fromHours, fromMinutes] = from.split(':').map(x => parseInt(x, 10));
  const fromMoment = moment().set({ hours: fromHours, minutes: fromMinutes });
  const [toHours, toMinutes] = to.split(':').map(x => parseInt(x, 10));
  const toMoment = moment().set({ hours: toHours, minutes: toMinutes });
  return `${fromMoment.format('LT')} - ${toMoment.format('LT')}`;
};

/** Ranges for different times */
const MORNING_RANGE = [0, 12];
const AFTERNOON_RANGE = [13, 17];
const EVENING_RANGE = [18, 23];
const RANGES = {
  morning: MORNING_RANGE,
  afternoon: AFTERNOON_RANGE,
  evening: EVENING_RANGE,
};

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const FulfillmentSlotSheet = ({
  isOpen, onClose, onChange, fulfillmentSlots, locationCode, fetch, allowClose,
}) => {
  // Group by date.
  const groupedSlots = useMemo(
    () => groupBy(fulfillmentSlots, 'date'),
    [fulfillmentSlots]
  );

  // Load slots when opening.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    fetch({ locationCode });
  }, [fetch, isOpen, locationCode]);

  // Handle active selected date.
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    if (!Object.keys(groupedSlots).length) {
      return;
    }
    // Don't change if selected date is still available
    if (groupedSlots[selectedDate]) {
      return;
    }
    setSelectedDate(Object.keys(groupedSlots)[0]);
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [groupedSlots]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Handle groups of time slots
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotGroups, setSlotGroups] = useState(null);
  useEffect(() => {
    if (!groupedSlots || !groupedSlots[selectedDate]) return;

    const slotGroupsNew = Object
      .keys(RANGES)
      .map((rangeName) => {
        const [start, end] = RANGES[rangeName];
        return {
          name: rangeName,
          slots: groupedSlots[selectedDate].filter((slot) => {
            const [startHour] = slot.from.split(':').map(x => parseInt(x, 10));
            return startHour >= start && startHour <= end;
          }),
        };
      })
      .filter(group => group.slots.length > 0);
    setSlotGroups(slotGroupsNew);
  }, [selectedDate, groupedSlots]);
  useEffect(() => {
    if (!selectedDate || !groupedSlots) {
      return;
    }

    // Select first active slot.
    setSelectedSlot(groupedSlots[selectedDate].find(slot => slot.status === 'active')?.id || null);
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [selectedDate]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const handleChange = useCallback(() => {
    onChange(fulfillmentSlots.find(slot => slot.id === selectedSlot));
  }, [fulfillmentSlots, onChange, selectedSlot]);

  return (
    <SheetDrawer
      isOpen={isOpen}
      title={i18n.text('locations.your_current_timeslot.dialog.title')}
      onDidClose={onClose}
      allowClose={allowClose}
    >
      <div className={styles.root}>
        <span className={styles.title}>
          {i18n.text('locations.your_current_timeslot.dialog.date')}
        </span>
        <div className={styles.row}>
          {Object.keys(groupedSlots).map(date => (
            <button
              type="button"
              key={date}
              className={classnames(
                styles.button,
                styles.buttonDate,
                {
                  [styles.buttonActive]: selectedDate === date,
                }
              )}
              onClick={() => setSelectedDate(date)}
            >
              <span className={styles.buttonLabel}>
                {moment(date, 'YYYY-MM-DD').format('dddd')}
                {' '}
                {getMonthDay(date)}
              </span>
            </button>
          ))}
        </div>
        {slotGroups && slotGroups.map(group => (
          <Fragment key={group.name}>
            <span className={styles.subtitle}>
              {i18n.text(`locations.your_current_timeslot.dialog.${group.name}`)}
            </span>
            <div className={styles.row}>
              {group.slots.map(slot => (
                <button
                  type="button"
                  key={`${slot.from}-${slot.to}`}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={classnames(
                    styles.button,
                    {
                      [styles.buttonDisabled]: slot.status !== 'active',
                      [styles.buttonActive]: slot.id === selectedSlot,
                    }
                  )}
                >
                  <span className={styles.buttonLabelSlot}>
                    {getRange(slot.from, slot.to)}
                  </span>
                  {slot.status !== 'active' ? (
                    <div className={styles.buttonStrikethrough} />
                  ) : null}
                </button>
              ))}
            </div>
          </Fragment>
        ))}
        <Button
          className={styles.buttonSchedule}
          type="secondary"
          onClick={handleChange}
          disabled={!selectedDate || !selectedSlot}
        >
          {i18n.text('locations.your_current_timeslot.dialog.schedule')}
        </Button>
      </div>
    </SheetDrawer>
  );
};

FulfillmentSlotSheet.propTypes = {
  fetch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  allowClose: PropTypes.bool,
  fulfillmentSlots: PropTypes.arrayOf(PropTypes.shape()),
  isOpen: PropTypes.bool,
  locationCode: PropTypes.string,
};
FulfillmentSlotSheet.defaultProps = {
  isOpen: false,
  locationCode: null,
  fulfillmentSlots: [],
  allowClose: true,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(FulfillmentSlotSheet);
