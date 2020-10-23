import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import { css } from 'glamor';
import classNames from 'classnames';
import moment from 'moment';
import CalendarIcon from '@shopgate/pwa-ui-shared/icons/CalendarIcon';
import appConfig, { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import { i18n } from '@shopgate/engage/core';
import SimpleInput from './SimpleInput';

const { variables } = themeConfig;

const locale = appConfig.language.substring(0, 2);

/**
 * @param {Object|string} date The input date
 * @returns {string}
 */
const getDateFromISO = (date) => {
  const result = moment(date);

  if (!result.isValid()) {
    return null;
  }

  return result.toDate();
};

/**
 * @param {Object|string} date The input date
 * @param {boolean} validate Should the date be validated
 * @returns {string}
 */
const getISOFormattedDate = (date, validate = true) => {
  const result = moment(date, 'L', locale);

  if (validate && !result.isValid()) {
    return '';
  }

  return result.format(moment.HTML5_FMT.DATE);
};

/**
 * @param {Object|string} date The input date
 * @returns {string}
 */
const getLocaleFormattedDate = (date) => {
  const result = moment(date);

  if (!result.isValid()) {
    return '';
  }
  return result.format('L');
};

const styles = {
  selectBox: css({
    WebkitAppearance: 'none',
    border: '1px solid var(--color-text-low-emphasis)',
    padding: '2px 16px 2px 6px',
    marginRight: 7,
    backgroundImage: 'url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDA1LjQ1NiA0MDUuNDU2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MDUuNDU2IDQwNS40NTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4NCjxnPg0KCTxwYXRoIGQ9Ik03NC4xMzQsNjQuMTQ3Yy00Ljk4NSwwLjA3OC05LjkxMSwyLjE2My0xMy40MzgsNS42ODhsLTU1LDU1QzIuMDk2LDEyOC40MzIsMCwxMzMuNDkyLDAsMTM4LjU4MyAgIHMyLjA5NiwxMC4xNTEsNS42OTcsMTMuNzVsMTgzLjI4MSwxODMuMjgxYzMuNTk5LDMuNjAxLDguNjU5LDUuNjk3LDEzLjc1LDUuNjk3czEwLjE1MS0yLjA5NiwxMy43NS01LjY5N2wxODMuMjgxLTE4My4yODEgICBjMy42MDEtMy41OTksNS42OTctOC42NTksNS42OTctMTMuNzVzLTIuMDk2LTEwLjE1MS01LjY5Ny0xMy43NWwtNTUtNTVjLTMuNTk4LTMuNTkxLTguNjUxLTUuNjgxLTEzLjczNC01LjY4MSAgIGMtNS4wODMsMC0xMC4xMzYsMi4wOS0xMy43MzQsNS42ODFMMjAyLjcyOCwxODQuMzk3TDg4LjE2Niw2OS44MzNDODQuNDk5LDY2LjE2OSw3OS4zMTgsNjQuMDcsNzQuMTM0LDY0LjE0N0w3NC4xMzQsNjQuMTQ3eiIgZmlsbD0iIzk2OTY5NiIvPg0KPC9nPg0KPC9zdmc+DQo=)',
    backgroundPosition: 'right 4px top 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 10,
    borderRadius: 0,
    outline: 0,
    cursor: 'pointer',
  }).toString(),
  iconWrapper: css({
    position: 'absolute',
    right: variables.gap.small,
    top: '50%',
    cursor: 'pointer',
    color: 'var(--color-text-high-emphasis)',
  }).toString(),
  pickerWrapper: css({
    position: 'relative',
    zIndex: 12,
  }).toString(),
  picker: css({
    left: 'inherit !important',
    right: 0,
    ' .DayPicker-Day': {
      padding: '3px !important',
    },
    ' .DayPicker-Day--selected': {
      backgroundColor: 'var(--color-primary) !important',
    },
    ' .DayPicker-Footer': {
      textAlign: 'center',
    },
    ' .DayPicker-TodayButton': {
      color: 'var(--color-primary) !important',
    },
    ' .DayPicker-TodayButton:hover': {
      backgroundColor: 'var(--color-primary) !important',
      color: '#fff !important',
    },
    ' .DayPicker-Caption': {
      padding: '0 !important',
    },
    ' .DayPicker-NavButton': {
      right: '.5em !important',
    },
  }).toString(),
  hidden: css({
    display: 'none',
  }).toString(),
};

const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear - 100, 11);
const toMonth = new Date(currentYear + 10, 11);

/**
 * @param {Object} props The components props
 * @returns {JSX}
 */
const Caption = ({ date, localeUtils, onChange }) => {
  const months = localeUtils.getMonths(locale);

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(e) {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  return (
    <div className="DayPicker-Caption">
      <select name="month" onChange={handleChange} value={date.getMonth()} className={styles.selectBox}>
        {months.map((month, i) => (
          <option key={month} value={i}>
            {month}
          </option>
        ))}
      </select>
      <select name="year" onChange={handleChange} value={date.getFullYear()} className={styles.selectBox}>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

Caption.propTypes = {
  date: PropTypes.shape().isRequired,
  localeUtils: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,

};

/**
 * @param {Object} props The components props
 * @returns {JSX}
 */
const DateInput = ({
  onFocusChange, onChange, type, value, ...rest
}) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [inputValue, setInputValue] = useState(getLocaleFormattedDate(value));
  const [pickerValue, setPickerValue] = useState(getDateFromISO(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const updated = getLocaleFormattedDate(value);

    if (updated) {
      setInputValue(updated);
      setPickerValue(getDateFromISO(value));
    }
  }, [value]);

  const handleInputValueChange = useCallback((val) => {
    setInputValue(val);
  }, []);

  const handleFocusChange = useCallback((focused, e) => {
    if (!focused) {
      setPickerValue(getDateFromISO(getISOFormattedDate(inputValue)));
      onChange(inputValue.length !== 0 ? getISOFormattedDate(inputValue, false) : null);
    }
    setIsFocused(focused);
    onFocusChange(focused, e);
  }, [inputValue, onChange, onFocusChange]);

  const handlePickerChange = useCallback((date) => {
    setPickerVisible(false);
    setPickerValue(date);
    setInputValue(getLocaleFormattedDate(date));
    onChange(getISOFormattedDate(date));
  }, [onChange]);

  const handleMonthChange = useCallback((date) => {
    setPickerValue(date);
  }, []);

  const handleIconClick = useCallback(() => {
    setPickerVisible(!pickerVisible);
  }, [pickerVisible]);

  const handleBackdropClick = useCallback(() => {
    setPickerVisible(false);
  }, []);

  return (
    <>
      <div>
        <SimpleInput
          {...rest}
          attributes={{ placeholder: isFocused ? i18n.text('formats.date.pattern') : null }}
          value={inputValue}
          type="text"
          onFocusChange={handleFocusChange}
          onChange={handleInputValueChange}
        />
        <div
          className={styles.iconWrapper}
          onClick={handleIconClick}
          role="button"
          tabIndex="0"
          onKeyDown={handleIconClick}
        >
          <CalendarIcon />
        </div>
      </div>
      <div className={classNames(styles.pickerWrapper, { [styles.hidden]: !pickerVisible })}>
        <DayPicker
          className={classNames('DayPickerInput-Overlay', styles.picker)}
          onDayClick={handlePickerChange}
          selectedDays={pickerValue}
          localeUtils={MomentLocaleUtils}
          locale={locale}
          todayButton={i18n.text('locations.your_current_timeslot.today')}
          onTodayButtonClick={handlePickerChange}
          month={pickerValue}
          showOutsideDays
          captionElement={({ date, localeUtils }) => (
            <Caption
              date={date}
              localeUtils={localeUtils}
              onChange={handleMonthChange}
            />
          )}
        />
      </div>

      { pickerVisible && (
        <Backdrop isVisible level={11} opacity={0} onClick={handleBackdropClick} />
      )}
    </>
  );
};

DateInput.propTypes = {
  onChange: PropTypes.func,
  onFocusChange: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string,
};

DateInput.defaultProps = {
  onFocusChange: () => {},
  onChange: () => {},
  type: null,
  value: null,
};

export default DateInput;
