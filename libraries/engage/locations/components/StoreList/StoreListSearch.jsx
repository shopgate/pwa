import React, {
  Fragment, useState, useRef, useCallback, useContext, useLayoutEffect, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import {
  ProgressBar, MagnifierIcon, LocatorIcon, MessageBar, InfoIcon, Grid,
} from '@shopgate/engage/components';
import { useCountriesNames } from '@shopgate/engage/i18n/countries.hooks';
import { FulfillmentContext } from '../../locations.context';
import connect from './StoreListSearch.connector';
import {
  container, queryLine, input, icon, progressBar, messageClass, iconClass, select, country,
  selectContainer,
} from './StoreListSearch.style';

/**
 * @param {Function} getProductLocations getProductLocations.
 * @param {Function} storeSearch .
 * @param {Object} search .
 * @returns {JSX}
 */
function StoreListSearch({ getProductLocations, storeSearch, search }) {
  const {
    product,
    locations,
    shopSettings: { supportedCountries } = {},
  } = useContext(FulfillmentContext);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState(search);
  const [message, setMessage] = useState('');
  const inputEl = useRef(null);

  useLayoutEffect(() => {
    if (!locations || locations.length === 0) {
      // Set a message when a location search resulted in zero locations.
      setMessage('locations.error_no_store_found');
    }
  }, [locations]);

  useEffect(() => {
    storeSearch(searchData);
  }, [searchData, storeSearch]);

  /**
   * Triggers a location update.
   * @param {string} [postalCode=null] An optional postal code.
   */
  const updateProductLocations = useCallback(async (searchParams = null) => {
    // Clear old error messages.
    setMessage('');
    setLoading(true);
    // Request new locations.
    const error = await getProductLocations(product.id, searchParams);

    if (error) {
      setMessage(error);
    }

    setLoading(false);
  }, [getProductLocations, product]);

  useLayoutEffect(() => {
    if (!product) {
      return;
    }

    setTimeout(() => { // wait for the sheet to be opened.
      updateProductLocations(searchData);
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** @param {Object} event A React event object */
  const handleOnChange = useCallback((event) => {
    const { target } = event;
    const data = {
      ...searchData,
      [target.name]: target.value,
    };
    setSearchData(data);
    if (target.name === 'countryCode') {
      updateProductLocations(data);
    }
  }, [searchData, updateProductLocations]);

  /**
   * Triggers a locations update by postal codes when the Enter key is pressed.
   * @param {Object} event A React event object.
   */
  const handleOnKeyDown = useCallback((event) => {
    if (event.keyCode === 13) {
      inputEl.current.blur();
      updateProductLocations(searchData);
    }
  }, [searchData, updateProductLocations]);

  /**
   * Triggers a locations update by geolocation.
   */
  const handleLocateMeButton = useCallback(() => {
    setSearchData({});
    updateProductLocations();
  }, [updateProductLocations]);

  const countries = useCountriesNames(supportedCountries);

  const { postalCode = '', countryCode = '' } = searchData;

  return (
    <Fragment>
      <div className={container}>
        <Grid>
          <Grid.Item grow={1} className={queryLine.toString()}>
            <span className={icon} aria-hidden>
              <MagnifierIcon />
            </span>
            <input
              ref={inputEl}
              name="postalCode"
              className={input}
              value={postalCode}
              onChange={handleOnChange}
              onKeyDown={handleOnKeyDown}
              disabled={loading}
              type="search"
              autoComplete="off"
              autoCorrect="off"
              placeholder={i18n.text('locations.search_placeholder')}
            />
            <button onClick={handleLocateMeButton} type="button" className={icon}>
              <LocatorIcon />
            </button>
          </Grid.Item>
          {supportedCountries && supportedCountries.length > 1 &&
            <Grid.Item shrink={0} className={country.toString()}>
              <div className={selectContainer}>
                <select
                  name="countryCode"
                  value={countryCode}
                  onChange={handleOnChange}
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

StoreListSearch.propTypes = {
  getProductLocations: PropTypes.func.isRequired,
  search: PropTypes.shape().isRequired,
  storeSearch: PropTypes.func.isRequired,
};

export default connect(StoreListSearch);
