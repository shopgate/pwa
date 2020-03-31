// @flow
import * as React from 'react';
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

type Props = {
  name: string,
  value: string,
  label: string,
  errorText: string,
  onChange: (value: string, event: any) => void;
}

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
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
export const ReserveFormPhone = React.memo<Props>((props: Props) => {
  const {
    name,
    value,
    onChange,
    label,
    errorText,
  } = props;
  const { shopSettings } = React.useContext(FulfillmentContext);

  const supportedCountries = React.useMemo(() => (
    shopSettings ? shopSettings.supportedCountries : []
  ), [shopSettings]);

  const countries = React.useMemo(() => {
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

  const labels = React.useMemo(() => {
    const output = {};

    if (!countries) {
      return output;
    }

    countries.forEach((key) => {
      const pieces = key.split('_');
      output[pieces[0]] = countriesNames[key];
    });

    return output;
  }, [countries, countriesNames]);

  const country = React.useMemo(() => {
    const phoneNumber = parsePhoneNumber(value || '');

    if (phoneNumber) {
      return phoneNumber.country;
    }

    return i18n.getLang().split('-')[1];
  }, [value]);

  const handleChange = React.useCallback((phoneValue) => {
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
        country={country}
        addInternationalOption={false}
        flags={flags}
        name="cellPhone"
        value={value}
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
