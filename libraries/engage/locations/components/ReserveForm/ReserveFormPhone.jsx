import React, {
  useMemo, useContext, memo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { i18n } from '@shopgate/engage/core';
import { parsePhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input/mobile';
import { getCountries } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en';
import de from 'react-phone-number-input/locale/de';
import es from 'react-phone-number-input/locale/es';
import fr from 'react-phone-number-input/locale/fr';
import pt from 'react-phone-number-input/locale/pt';
import flags from 'react-phone-number-input/flags';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import { useCountriesNames } from '@shopgate/engage/i18n';
import { FulfillmentContext } from '../../locations.context';
import {
  formField, phoneField, phoneFieldError, phoneFieldErrorText,
} from './ReserveForm.style';
import connect from './ReserveFormPhone.connector';

/**
 * @typedef {import('./ReserveFormPhone.types').OwnProps} OwnProps
 * @typedef {import('./ReserveFormPhone.types').StateProps} StateProps
 */

/**
 * @typedef {OwnProps & StateProps} Props
 */

const builtInCountries = getCountries();
const locales = {
  en,
  de,
  es,
  fr,
  pt,
};

/**
 * Renders the reserve form phone input maybe with country selection.
 * @param {Props} props The component props.
 * @returns {JSX.Element}
 */
const ReserveFormPhoneUnwrapped = memo((props) => {
  const {
    name,
    value,
    onChange,
    label,
    errorText,
    userLocation,
  } = props;
  const { shopSettings, userInput } = useContext(FulfillmentContext);

  const initialValue = useMemo(() => (
    userInput && userInput[name] ? userInput[name] : ''
  ), [name, userInput]);

  const supportedCountries = useMemo(() => (
    shopSettings ? shopSettings.supportedCountries : []
  ), [shopSettings]);

  const countries = useMemo(() => {
    if (!supportedCountries) {
      return builtInCountries;
    }

    const sortedCountries = [
      ...builtInCountries,
    ];

    const sanitizedSupportedCountries = supportedCountries.map((country) => {
      const pieces = country.split('_');
      return pieces[0];
    });

    sanitizedSupportedCountries.forEach((country) => {
      sortedCountries.splice(sortedCountries.indexOf(country), 1);
    });

    return [
      ...sanitizedSupportedCountries,
      ...sortedCountries,
    ];
  }, [supportedCountries]);

  const countriesNames = useCountriesNames(supportedCountries, locales);

  const labels = useMemo(() => {
    const output = {};

    if (!Array.isArray(countries) || countries.length === 0) {
      return output;
    }

    countries.forEach((key) => {
      const pieces = key.split('_');
      output[pieces[0]] = countriesNames[key];
    });

    return output;
  }, [countries, countriesNames]);

  const defaultCountry = useMemo(() => {
    if (!initialValue && !value && userLocation) {
      return userLocation.country;
    }

    const phoneNumber = parsePhoneNumber(value || '');

    if (phoneNumber && phoneNumber.country) {
      return phoneNumber.country;
    }

    if (userLocation && userLocation.country) {
      return userLocation.country;
    }

    return i18n.getLang().split('-')[1];
  }, [initialValue, userLocation, value]);

  const handleChange = useCallback((phoneValue) => {
    onChange(phoneValue, { target: { name } });
  }, [name, onChange]);

  const phoneClasses = classnames({
    [phoneField]: true,
    [phoneFieldError]: !!errorText,
  });

  if (!countries || countries.length === 0) {
    return (
      <TextField
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        className={formField}
        errorText={errorText}
      />
    );
  }

  return (
    <div className={phoneClasses}>
      <PhoneInput
        defaultCountry={defaultCountry}
        addInternationalOption={false}
        flags={flags}
        name={name}
        value={value || ''}
        onChange={handleChange}
        placeholder={label}
        countries={countries}
        labels={labels}
      />
      {!!errorText && (
        <div className={phoneFieldErrorText}>
          {errorText}
        </div>
      )}
    </div>
  );
});

ReserveFormPhoneUnwrapped.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  userLocation: PropTypes.shape({
    country: PropTypes.string,
  }),
  value: PropTypes.string,
};

ReserveFormPhoneUnwrapped.defaultProps = {
  errorText: '',
  userLocation: null,
  value: '',
};

export const ReserveFormPhone = connect(ReserveFormPhoneUnwrapped);
