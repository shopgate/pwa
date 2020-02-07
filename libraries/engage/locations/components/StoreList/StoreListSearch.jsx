import React, {
  Fragment, useState, useRef, useCallback, useContext, useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import {
  ProgressBar, MagnifierIcon, LocatorIcon, MessageBar,
} from '@shopgate/engage/components';
import { withCurrentProduct } from '../../../core/hocs/withCurrentProduct';
import FulfillmentContext from '../context';
import connect from './StoreListSearch.connector';
import {
  container, search, input, icon, progressBar,
} from './StoreListSearch.style';

/**
 * The StoreListSearch component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function StoreListSearch(props) {
  const {
    productId,
    loading,
    getProductLocations,
  } = props;

  const { locations } = useContext(FulfillmentContext);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const inputEl = useRef(null);

  useLayoutEffect(() => {
    if (locations.length === 0) {
      // Set a message when a location search resulted in zero locations.
      setMessage('locations.error_no_store_found');
    }
  }, [locations]);

  /**
   * Triggers a location update.
   * @param {string} [postalCode=null] An optional postal code.
   */
  const updateProductLocations = useCallback(async (postalCode = null) => {
    // Clear old error messages.
    setMessage('');
    // Request new locations.
    const error = await getProductLocations(productId, postalCode);

    if (error) {
      // Show a message when the locations request failed.
      setMessage(error);
    }
  }, [getProductLocations, productId]);

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
      { message &&
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
  loading: PropTypes.bool,
  productId: PropTypes.string,
};

StoreListSearch.defaultProps = {
  productId: null,
  loading: false,
};

export const StoreListSearchUnwrapped = StoreListSearch;

export default withCurrentProduct(connect(StoreListSearch));
