// @flow
import * as React from 'react';
import classnames from 'classnames';
import { camelCase, upperCase, isEqual } from 'lodash';
import { i18n } from '@shopgate/engage/core';
import { parsePhoneNumber } from 'react-phone-number-input';
import PhoneInputCountrySelect from 'react-phone-number-input/mobile';
import PhoneInput from 'react-phone-number-input/input-mobile';
import { getCountries } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en';
import de from 'react-phone-number-input/locale/de';
import es from 'react-phone-number-input/locale/es';
import fr from 'react-phone-number-input/locale/fr';
import pt from 'react-phone-number-input/locale/pt';
import flags from 'react-phone-number-input/flags';
import { useCountriesNames } from '@shopgate/engage/i18n';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import Label from '@shopgate/pwa-ui-shared/TextField/components/Label';
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
      countrySortOrder?: string[],
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
    disabled = false,
    config: {
      supportedCountries = [],
      countrySortOrder = [],
      userLocation = {},
    } = {},
  } = element;

  const [isFocused, setIsFocused] = React.useState(false);

  // Maps available countries to correct format.
  const countries = React.useMemo(() => {
    if (supportedCountries.length === 0) {
      return builtInCountries;
    }

    return supportedCountries.map((country) => {
      const pieces = country.split('_');
      return upperCase(pieces[0]);
    });
  }, [supportedCountries]);

  const countriesNames = useCountriesNames(countries, locales);

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

  const defaultCountry = React.useMemo(() => {
    let country;

    if (value) {
      // Try to parse the value the determine a country
      const phoneNumber = parsePhoneNumber(value || '');

      if (phoneNumber && phoneNumber.country) {
        ({ country } = phoneNumber);
      }
    }

    if (!country && userLocation) {
      // Take the country from the user location if present
      ({ country } = userLocation);
    }

    if (!country) {
      // If no country could be determined yet, take the country from the language
      ([, country] = i18n.getLang().split('-'));
    }

    // Check if the determined country is included inside the available countries
    if (!countries.includes(country)) {
      if (countrySortOrder?.length && countries.includes(countrySortOrder[0])) {
        // Take first country if the sort order list if present
        ([country] = countrySortOrder);
      } else {
        // Take first country from the list
        ([country] = countries);
      }
    }

    return country;
  }, [countries, countrySortOrder, userLocation, value]);

  const countryOptionsOrder = React.useMemo(() => {
    const countryListsEqual = isEqual([...countries].sort(), [...countrySortOrder].sort());
    /**
     * When list with supported countries has the same entries as the country sort order, we don't
     * need to add a separator to the countryOptionsOrder array since the country picker lists
     * will not show a section with unordered countries.
     */
    return countrySortOrder.length
      ? [...countrySortOrder, ...(countryListsEqual ? [] : ['|'])]
      : [];
  }, [countries, countrySortOrder]);

  const hasCountrySelect = React.useMemo(() => countries.length > 1, [countries.length]);

  const handleChangeWrapped = React.useCallback((phoneValue) => {
    handleChange(phoneValue, { target: { name } });
  }, [handleChange, name]);

  const phoneClasses = classnames('textField', {
    simpleInput: !hasCountrySelect,
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

  const Component = hasCountrySelect ? PhoneInputCountrySelect : PhoneInput;

  return (
    <div className="formBuilderField">
      <div className={phoneClasses}>
        <Label
          label={label}
          isFocused={isFocused}
          isFloating={isFocused || !!value}
        />
        <Component
          defaultCountry={defaultCountry}
          name={name}
          value={value || ''}
          onChange={handleChangeWrapped}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          {...hasCountrySelect ? {
            countryOptionsOrder,
            addInternationalOption: false,
            flags,
            countries,
            labels,
          } : {
            className: 'PhoneInputInput',
          }}
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
