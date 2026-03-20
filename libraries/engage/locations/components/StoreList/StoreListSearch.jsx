import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';
import {
  InfoIcon,
  LocatorIcon,
  MagnifierIcon,
  MessageBar,
  SurroundPortals,
} from '@shopgate/engage/components';
import { useCountriesNames } from '@shopgate/engage/i18n';
import StoreListSearchRadius from './StoreListSearchRadius';
import { FulfillmentContext, StoreFinderContext } from '../../locations.context';
import connect from './StoreListSearch.connector';
import { FULFILLMENT_SHEET_SEARCH } from '../../constants/Portals';

const useStyles = makeStyles()({
  container: {
    padding: '0 12px 8px 12px',
    background: themeColors.light,
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
      "countries input"
      "radius radius"
    `,
  },
  countriesCell: {
    gridArea: 'countries',
    maxWidth: 160,
    paddingRight: themeVariables.gap.small,
  },
  inputCell: {
    gridArea: 'input',
  },
  radiusCell: {
    gridArea: 'radius',
    ':not(:empty)': {
      height: 38,
      marginTop: themeVariables.gap.small,
    },
  },
  selectContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
    height: '100%',
    '&:after': {
      zIndex: 2,
      content: '""',
      position: 'absolute',
      display: 'block',
      top: '50%',
      right: themeVariables.gap.small * 1.5,
      transform: 'translate3d(0, -25%, 0)',
      width: 5,
      height: 5,
      border: '5px solid transparent',
      borderTopColor: themeColors.shade6,
    },
  },
  select: {
    appearance: 'none',
    border: `1px solid ${themeColors.shade7}`,
    padding: `0 ${themeVariables.gap.bigger + themeVariables.gap.small * 1.5}px 0 ${themeVariables.gap.big * 0.75}px`,
    color: themeColors.shade11,
    fontSize: '1rem',
    borderRadius: 4,
    width: '100%',
    outline: 0,
  },
  inputContainer: {
    background: themeColors.light,
    border: `1px solid ${themeColors.shade7}`,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    margin: '3px 0',
    width: '100%',
    lineHeight: '28px',
    outline: 'none',
    verticalAlign: 'middle',
    WebkitAppearance: 'none',
  },
  inputIcon: {
    padding: 0,
    margin: '0 8px',
    color: themeColors.shade9,
    fontSize: '1.23rem',
    flexShrink: 0,
    outline: 0,
  },
  iconClass: {
    fontSize: '1.25rem !important',
  },
});

/**
 * @param {Function} getProductLocations getProductLocations.
 * @param {Function} storeSearch .
 * @param {Object} search .
 * @returns {JSX}
 */
function StoreListSearch({
  postalCode,
  countryCode,
  setPostalCode,
  setCountryCode,
  setGeolocation,
  isStoreFinder,
}) {
  const { classes } = useStyles();
  const {
    isLoading,
    setIsLoading,
    locations,
    shopSettings: { supportedCountries } = {},
    product,
  } = useContext(isStoreFinder ? StoreFinderContext : FulfillmentContext);

  const [message, setMessage] = useState('');
  const [inputPostalCode, setInputPostalCode] = useState(postalCode || '');
  const isMounted = useRef(false);
  const productId = product?.id || null;

  const inputEl = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return function cleanup() {
      isMounted.current = false;
    };
  });

  useLayoutEffect(() => {
    if (!isLoading && (!locations || locations.length === 0)) {
      // Set a message when a location search resulted in zero locations.
      setMessage('locations.error_no_store_found');
    } else {
      setMessage('');
    }
  }, [isLoading, locations, message]);

  /**
   * Triggers an update when the value of the country selector changed.
   * @param {SyntheticEvent} event A React event object.
   */
  const handleCountrySelectChange = useCallback((event) => {
    setCountryCode(event.target.value, productId, isStoreFinder);
  }, [isStoreFinder, productId, setCountryCode]);

  useEffect(() => {
    if (!Array.isArray(supportedCountries) || !supportedCountries.length) {
      return;
    }

    // Check if current countryCode is included in supportedCountries. Update the code to a valid
    // one if nothing was found.
    if (!supportedCountries.includes(countryCode)) {
      handleCountrySelectChange({ target: { value: supportedCountries[0] } });
    }
  }, [countryCode, handleCountrySelectChange, supportedCountries]);

  /**
   * Blurs the postal code input to trigger an update.
   * @param {SyntheticEvent} event A React event object.
   */
  const handlePostalCodeSubmitKeyDown = useCallback((event) => {
    if (event.keyCode === 13) {
      inputEl.current.blur();
    }
  }, []);

  /**
   * Triggers an update when the input blurs.
   */
  const handlePostalCodeBlur = useCallback(() => {
    setPostalCode(inputPostalCode, productId, isStoreFinder);
  }, [inputPostalCode, isStoreFinder, productId, setPostalCode]);

  /**
   * Triggers an update when the locate me button was pressed. Also clears the local state for the
   * postal code input.
   */
  const handleLocateMeButton = useCallback(async () => {
    setInputPostalCode('');
    setIsLoading(true);
    await setGeolocation({
      productId,
      isStoreFinder,
    });
    setIsLoading(false);
  }, [isStoreFinder, productId, setGeolocation, setIsLoading]);

  /**
   * Updates the local state for the postal code input.
   * @param {SyntheticEvent} event A React event object
   */
  const handlePostalCodeChange = (event) => {
    setInputPostalCode(event.target.value);
  };

  const countries = useCountriesNames(supportedCountries);
  const hasSupportedCountries = supportedCountries && supportedCountries.length > 1;

  return (
    <SurroundPortals
      portalName={FULFILLMENT_SHEET_SEARCH}
      portalProps={{ product }}
    >
      <div className={classes.container}>
        {hasSupportedCountries && (
          <div className={classes.countriesCell}>
            <div className={classes.selectContainer}>
              <select
                name="countryCode"
                value={countryCode}
                onChange={handleCountrySelectChange}
                className={classes.select}
              >
                {
                  Object.keys(countries).map(key => (
                    <option className="option" value={key} key={key}>{countries[key]}</option>
                  ))
                }
              </select>
            </div>
          </div>
        )}

        <div className={classes.inputCell}>
          <div className={classes.inputContainer}>
            <span className={classes.inputIcon} aria-hidden>
              <MagnifierIcon />
            </span>
            <input
              ref={inputEl}
              name="postalCode"
              className={classes.input}
              value={inputPostalCode}
              onChange={handlePostalCodeChange}
              onBlur={handlePostalCodeBlur}
              onKeyDown={handlePostalCodeSubmitKeyDown}
              disabled={isLoading}
              type="search"
              autoComplete="off"
              autoCorrect="off"
              placeholder={i18n.text('locations.search_placeholder')}
              aria-label={i18n.text('locations.search_placeholder')}
            />
            <button
              onClick={handleLocateMeButton}
              type="button"
              className={classes.inputIcon}
              aria-label={i18n.text('locations.stores_near.location')}
            >
              <LocatorIcon />
            </button>
          </div>

        </div>
        <div className={classes.radiusCell}>
          { isStoreFinder && (
          <StoreListSearchRadius />
          )}
        </div>
      </div>
      {message &&
        <MessageBar
          messages={[{
            type: 'error',
            message,
            icon: InfoIcon,
          }]}
          classNames={{
            icon: classes.iconClass,
          }}
        />}
    </SurroundPortals>
  );
}

StoreListSearch.defaultProps = {
  postalCode: null,
  isStoreFinder: false,
};

StoreListSearch.propTypes = {
  countryCode: PropTypes.string.isRequired,
  setCountryCode: PropTypes.func.isRequired,
  setGeolocation: PropTypes.func.isRequired,
  setPostalCode: PropTypes.func.isRequired,
  isStoreFinder: PropTypes.bool,
  postalCode: PropTypes.string,
};

export default connect(memo(StoreListSearch));
