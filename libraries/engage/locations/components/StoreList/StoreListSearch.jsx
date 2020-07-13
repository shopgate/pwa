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
  postalCode,
  countryCode,
  setPostalCode,
  setCountryCode,
  setGeolocation,
}) {
  const {
    isFetching,
    locations,
    shopSettings: { supportedCountries } = {},
  } = useContext(FulfillmentContext);

  const loading = isFetching;
  const [message, setMessage] = useState('');
  const [inputPostalCode, setInputPostalCode] = useState(postalCode || '');
  const isMounted = useRef(false);

  const inputEl = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return function cleanup() {
      isMounted.current = false;
    };
  });

  useLayoutEffect(() => {
    if ((!isFetching || message === 'locations.error_no_store_found') && (!locations || locations.length === 0)) {
      // Set a message when a location search resulted in zero locations.
      setMessage('locations.error_no_store_found');
    } else {
      setMessage('');
    }
  }, [isFetching, locations, message]);

  /**
   * Triggers an update when the value of the country selector changed.
   * @param {SyntheticEvent} event A React event object.
   */
  const handleCountrySelectChange = useCallback((event) => {
    setCountryCode(event.target.value);
  }, [setCountryCode]);

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
    setPostalCode(inputPostalCode);
  }, [inputPostalCode, setPostalCode]);

  /**
   * Triggers an update when the locate me button was pressed. Also clears the local state for the
   * postal code input.
   */
  const handleLocateMeButton = useCallback(() => {
    setGeolocation();
    setInputPostalCode('');
  }, [setGeolocation]);

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
  setCountryCode: PropTypes.func.isRequired,
  setGeolocation: PropTypes.func.isRequired,
  setPostalCode: PropTypes.func.isRequired,
  postalCode: PropTypes.string,
};

export default connect(memo(StoreListSearch));
