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
import {
  container,
  countriesCell,
  inputCell,
  radiusCell,
  inputIcon,
  iconClass,
  input,
  inputContainer,
  select,
  selectContainer,
} from './StoreListSearch.style';
import { FULFILLMENT_SHEET_SEARCH } from '../../constants/Portals';

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
    if ((!isLoading || message === 'locations.error_no_store_found') && (!locations || locations.length === 0)) {
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
      <div className={container}>
        {hasSupportedCountries && (
          <div className={countriesCell}>
            <div className={selectContainer}>
              <select
                name="countryCode"
                value={countryCode}
                onChange={handleCountrySelectChange}
                className={select}
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

        <div className={inputCell}>
          <div className={inputContainer}>
            <span className={inputIcon} aria-hidden>
              <MagnifierIcon />
            </span>
            <input
              ref={inputEl}
              name="postalCode"
              className={input}
              value={inputPostalCode}
              onChange={handlePostalCodeChange}
              onBlur={handlePostalCodeBlur}
              onKeyDown={handlePostalCodeSubmitKeyDown}
              disabled={isLoading}
              type="search"
              autoComplete="off"
              autoCorrect="off"
              placeholder={i18n.text('locations.search_placeholder')}
            />
            <button
              onClick={handleLocateMeButton}
              type="button"
              className={inputIcon}
            >
              <LocatorIcon />
            </button>
          </div>

        </div>
        <div className={radiusCell}>
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
            icon: iconClass,
          }}
        />
      }
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
