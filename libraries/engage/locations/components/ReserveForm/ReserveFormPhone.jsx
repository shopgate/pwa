// @flow
import * as React from 'react';
import classnames from 'classnames';
import PhoneInput from 'react-phone-number-input/mobile';
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

  const supportedCountries = React.useMemo(() => {
    if (!shopSettings) {
      return [];
    }

    return shopSettings.supportedCountries;
  }, [shopSettings]);

  const countries = React.useMemo(() => {
    if (!supportedCountries) {
      return [];
    }

    return supportedCountries.map((country) => {
      const pieces = country.split('_');
      return pieces[0];
    });
  }, [supportedCountries]);

  const countriesNames = useCountriesNames(supportedCountries);

  const labels = React.useMemo(() => {
    const output = {};

    if (!supportedCountries) {
      return output;
    }

    supportedCountries.forEach((key) => {
      const pieces = key.split('_');
      output[pieces[0]] = countriesNames[key];
    });

    return output;
  }, [countriesNames, supportedCountries]);

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
