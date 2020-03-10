import React, {
  Fragment, useState, useRef, useCallback, useContext, useLayoutEffect, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import {
  ProgressBar, MagnifierIcon, LocatorIcon, MessageBar,
} from '@shopgate/engage/components';
import { FulfillmentContext } from '../../locations.context';
import connect from './StoreListSearch.connector';
import {
  container, search, input, icon, progressBar,
} from './StoreListSearch.style';

/**
 * @param {Function} getProductLocations getProductLocations.
 * @returns {JSX}
 */
function StoreListSearch({ getProductLocations, storeSearchQuery, searchQuery }) {
  const { product, locations } = useContext(FulfillmentContext);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchQuery);
  const [message, setMessage] = useState('');
  const inputEl = useRef(null);

  useLayoutEffect(() => {
    if (!locations || locations.length === 0) {
      // Set a message when a location search resulted in zero locations.
      setMessage('locations.error_no_store_found');
    }
  }, [locations]);

  useEffect(() => {
    storeSearchQuery(query);
  }, [query, storeSearchQuery]);

  /**
   * Triggers a location update.
   * @param {string} [postalCode=null] An optional postal code.
   */
  const updateProductLocations = useCallback(async (postalCode = null) => {
    // Clear old error messages.
    setMessage('');
    setLoading(true);
    // Request new locations.
    const error = await getProductLocations(product.id, postalCode);

    if (error) {
      setMessage(error);
    }

    setLoading(false);
  }, [getProductLocations, product]);

  useEffect(() => {
    if (query !== '') {
      updateProductLocations(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Updates the query state of the component when the input changes.
   * @param {Object} event A React event object.
   */
  const handleOnChange = useCallback((event) => {
    setQuery(event.target.value);
  }, []);

  /**
   * Triggers a locations update by postal codes when the Enter key is pressed.
   * @param {Object} event A React event object.
   */
  const handleOnKeyDown = useCallback((event) => {
    if (event.keyCode === 13) {
      inputEl.current.blur();
      updateProductLocations(query);
    }
  }, [query, updateProductLocations]);

  /**
   * Triggers a locations update by geolocation.
   */
  const handleLocateMeButton = useCallback(() => {
    setQuery('');
    updateProductLocations();
  }, [updateProductLocations]);

  return (
    <Fragment>
      <div className={container}>
        <div className={search}>
          <span className={icon} aria-hidden>
            <MagnifierIcon />
          </span>
          <input
            ref={inputEl}
            className={input}
            value={query}
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
        </div>
      </div>
      <div className={progressBar}>
        <ProgressBar isVisible={loading} />
      </div>
      {message &&
        <MessageBar messages={[{
          type: 'error',
          message,
        }]}
        />
      }
    </Fragment>
  );
}

StoreListSearch.propTypes = {
  getProductLocations: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  storeSearchQuery: PropTypes.func.isRequired,
};

export default connect(StoreListSearch);
