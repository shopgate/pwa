// @flow
import * as React from 'react';
import classnames from 'classnames';
import { camelCase } from 'lodash';
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
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import FormHelper from './FormHelper';

const { variables, colors } = themeConfig;

const styles = {
  formField: css({
    width: '100%',
    marginBottom: '0px !important',
  }).toString(),

  phoneField: css({
    position: 'relative',
    width: '100%',
    paddingTop: variables.gap.big * 0.75,
    paddingBottom: variables.gap.big * 1.25,

    ' input.PhoneInputInput': {
      outline: 'none',
      fontSize: '1rem',
      lineHeight: '1.1875rem',
      borderRadius: 0,
      paddingBottom: variables.gap.xsmall * 1.5,
      borderBottom: `1px solid ${colors.shade12}`,
      '&:focus': {
        borderBottom: `2px solid ${colors.primary}`,
        paddingBottom: (variables.gap.xsmall * 1.5) - 1,
      },
    },
  }),

  phoneFieldError: css({
    ' input.PhoneInputInput': {
      borderBottom: `2px solid var(--color-state-alert, ${colors.error})`,
      paddingBottom: (variables.gap.xsmall * 1.5) - 1,
    },
  }).toString(),

  phoneFieldErrorText: css({
    position: 'absolute',
    width: '100%',
    bottom: '-10px',
    fontSize: '0.75rem',
    lineHeight: 0.875,
    color: `var(--color-state-alert, ${colors.error})`,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginLeft: '38px',
  }),
};

type Props = {
  name: string,
  errorText: string,
  value: string,
  visible: boolean,
  formName: string,
  element: {
    default?: string,
    label?: string,
    disabled?: bool,
    handleChange: (string, any) => void,
    config?: {
      supportedCountries?: string[],
      userLocation?: any,
    }
  },
};

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
const UnwrappedElementPhoneNumber = React.memo<Props>((props: Props) => {
  const {
    element,
    name,
    errorText,
    value,
    visible,
    formName,
  } = props;
  const {
    label,
    handleChange,
    default: defaultValue = '',
    disabled = false,
    config: {
      supportedCountries = [],
      userLocation = {},
    } = {},
  } = element;

  const [isFocused, setIsFocused] = React.useState(false);

  // Maps available countries to correct format.
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

  // Get labels for supported countries.
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

  // Sets the default country based on the users location.
  const defaultCountry = React.useMemo(() => {
    if (!defaultValue && !value && userLocation) {
      return userLocation.country;
    }

    const phoneNumber = parsePhoneNumber(value || '');

    if (phoneNumber && phoneNumber.country) {
      return phoneNumber.country;
    }

    if (userLocation) {
      return userLocation.country;
    }

    return i18n.getLang().split('-')[1];
  }, [defaultValue, userLocation, value]);

  const handleChangeWrapped = React.useCallback((phoneValue) => {
    handleChange(phoneValue, { target: { name } });
  }, [handleChange, name]);

  const phoneClasses = classnames({
    [camelCase(name)]: true,
    phonePicker: true,
    phonePickerError: !!errorText,
    validationError: !!errorText,
    phonePickerFocused: isFocused,
    [styles.phoneField]: true,
    [styles.phoneFieldError]: !!errorText,
  });

  if (!visible) {
    return null;
  }

  if (!countries || countries.length === 0) {
    return (
      <>
        <TextField
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          label={label}
          className={classnames(styles.formField, { validationError: !!errorText })}
          disabled={disabled}
        />
        <FormHelper errorText={errorText} element={element} />
      </>
    );
  }

  return (
    <div className="formBuilderField">
      <div className={phoneClasses}>
        <PhoneInput
          defaultCountry={defaultCountry}
          addInternationalOption={false}
          flags={flags}
          name={name}
          value={value || ''}
          onChange={handleChangeWrapped}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={label}
          countries={countries}
          labels={labels}
          disabled={disabled}
          countryOptionsOrder={supportedCountries.length ? [...supportedCountries, '|'] : []}
        />
      </div>
      <FormHelper
        errorText={errorText}
        element={element}
        formName={formName}
      />
    </div>
  );
});

export default UnwrappedElementPhoneNumber;
