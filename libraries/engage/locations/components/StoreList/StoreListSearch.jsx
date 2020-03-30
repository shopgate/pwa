import React, {
  Fragment,
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
  Grid,
  InfoIcon,
  LocatorIcon,
  MagnifierIcon,
  MessageBar,
  ProgressBar,
} from '@shopgate/engage/components';
import { useCountriesNames } from '@shopgate/engage/i18n';
import { FulfillmentContext } from '../../locations.context';
import connect from './StoreListSearch.connector';
import {
  country,
  container,
  inputIcon,
  iconClass,
  input,
  messageClass,
  progressBar,
  queryLine,
  select,
  selectContainer,
} from './StoreListSearch.style';

/**
 * @param {Function} getProductLocations getProductLocations.
 * @param {Function} storeSearch .
 * @param {Object} search .
 * @returns {JSX}
 */
function StoreListSearch({
  getProductLocations,
  postalCode,
  countryCode,
  setPostalCode,
  setCountryCode,
}) {
  const {
    product,
    locations,
    shopSettings: { supportedCountries } = {},
  } = useContext(FulfillmentContext);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [inputPostalCode, setInputPostalCode] = useState(postalCode || '');

  const inputEl = useRef(null);

  useLayoutEffect(() => {
    if (!locations || locations.length === 0) {
      // Set a message when a location search resulted in zero locations.
      setMessage('locations.error_no_store_found');
    }
  }, [locations]);

  /**
   * Triggers a location update.
   * @param {Object} searchParams Parameters for the getProductLocation action call.
   * @param {string} [silent=false] If set to TRUE users will not get see any feedback popups when
   * geolocation tracking fails.
   */
  const updateProductLocations = useCallback(async (searchParams, silent = false) => {
    // Clear old error messages.
    setMessage('');
    setLoading(true);

    // Request new locations.
    const error = await getProductLocations(product.id, searchParams, silent);

    if (error) {
      setMessage(error);
    }

    setLoading(false);
  }, [getProductLocations, product.id]);

  /**
   * Triggers a product locations update at the initial rendering of the component. Potential
   * feedback popups on declined geolocation permissions will be suppressed.
   */
  useEffect(() => {
    let searchParams = null;

    if (postalCode !== null) {
      searchParams = {
        postalCode,
        countryCode,
      };
    }

    updateProductLocations(searchParams, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Triggers an update of Redux postalCode and countryCode and triggers fetching of new locations.
   * @param {string|null} postalCode Postal code for the update.
   * @param {string} [countryCode=countryCode] Country code for the update.
   */
  const update = useCallback((postalCodeUpdate, countryCodeUpdate = countryCode) => {
    if (postalCodeUpdate !== postalCode) {
      setPostalCode(postalCodeUpdate);
    }

    if (countryCodeUpdate !== countryCode) {
      setCountryCode(countryCodeUpdate);

      if (!postalCode) {
        // Prevent location update when the country selection changed, but the postal code is empty.
        return;
      }
    }

    let searchParams = null;

    if (postalCodeUpdate !== null) {
      searchParams = {
        postalCode: postalCodeUpdate,
        countryCode: countryCodeUpdate,
      };
    }

    updateProductLocations(searchParams);
  }, [countryCode, postalCode, setCountryCode, setPostalCode, updateProductLocations]);

  /**
   * Triggers an update when the value of the country selector changed.
   * @param {SyntheticEvent} event A React event object.
   */
  const handleCountrySelectChange = useCallback((event) => {
    update(postalCode, event.target.value);
  }, [update, postalCode]);

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
    update(inputPostalCode);
  }, [inputPostalCode, update]);

  /**
   * Triggers an update when the locate me button was pressed. Also clears the local state for the
   * postal code input.
   */
  const handleLocateMeButton = useCallback(() => {
    setInputPostalCode('');
    update(null);
  }, [update]);

  /**
   * Updates the local state for the postal code input.
   * @param {SyntheticEvent} event A React event object
   */
  const handlePostalCodeChange = (event) => {
    setInputPostalCode(event.target.value);
  };

  const countries = useCountriesNames(supportedCountries);

  return (
    <Fragment>
      <div className={container}>
        <Grid>
          {supportedCountries && supportedCountries.length > 1 &&
            <Grid.Item shrink={0} className={country.toString()}>
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
            </Grid.Item>
          }
          <Grid.Item grow={1} className={queryLine.toString()}>
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
              disabled={loading}
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
          </Grid.Item>
        </Grid>
      </div>
      <div className={progressBar}>
        <ProgressBar isVisible={loading} />
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
            message: messageClass,
          }}
        />
      }
    </Fragment>
  );
}

StoreListSearch.defaultProps = {
  postalCode: null,
};

StoreListSearch.propTypes = {
  countryCode: PropTypes.string.isRequired,
  getProductLocations: PropTypes.func.isRequired,
  setCountryCode: PropTypes.func.isRequired,
  setPostalCode: PropTypes.func.isRequired,
  postalCode: PropTypes.string,
};

export default connect(memo(StoreListSearch));
