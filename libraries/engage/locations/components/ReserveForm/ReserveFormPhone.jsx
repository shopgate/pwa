import React, {
  useMemo, useContext, memo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core/helpers';
import { parsePhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input/mobile';
import { getCountries } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en.json';
import de from 'react-phone-number-input/locale/de.json';
import es from 'react-phone-number-input/locale/es.json';
import fr from 'react-phone-number-input/locale/fr.json';
import pt from 'react-phone-number-input/locale/pt.json';
import flags from 'react-phone-number-input/flags';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import { useCountriesNames } from '@shopgate/engage/i18n';
import { FulfillmentContext } from '../../locations.context';
import connect from './ReserveFormPhone.connector';

const { variables, colors } = themeConfig;

const useStyles = makeStyles()({
  formField: {
    width: '100%',
    paddingBottom: variables.gap.small,
  },
  phoneField: {
    position: 'relative',
    width: '100%',
    paddingTop: variables.gap.big * 0.75,
    paddingBottom: variables.gap.big * 1.25,
    marginBottom: variables.gap.small,
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
  },
  phoneFieldError: {
    ' input.PhoneInputInput': {
      borderBottom: '2px solid var(--color-state-alert) !important',
      paddingBottom: (variables.gap.xsmall * 1.5) - 1,
    },
  },
  phoneFieldErrorText: {
    position: 'absolute',
    width: '100%',
    bottom: 2,
    fontSize: '0.75rem',
    lineHeight: 0.875,
    color: 'var(--color-state-alert)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

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
  const { classes } = useStyles();
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

    if (!countries || !Array.isArray(countries) || countries.length === 0) {
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
    [classes.phoneField]: true,
    [classes.phoneFieldError]: !!errorText,
  });

  if (!countries || countries.length === 0) {
    return (
      <TextField
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        className={classes.formField}
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
        <div className={classes.phoneFieldErrorText}>
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
