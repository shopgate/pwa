import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { i18n, withCurrentProduct } from '@shopgate/engage/core';
import { ProgressBar, MagnifierIcon, LocatorIcon } from '@shopgate/engage/components';
import connect from './SearchField.connector';
import {
  container, search, input, icon, progressBar,
} from './SearchField.style';

/**
 * The SearchField component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function SearchField(props) {
  const {
    productId,
    loading,
    getLocationsByPostalCode,
    getLocationsByGeolocation,
  } = props;

  const [query, setQuery] = useState('');

  /**
   * Updates the query state of the component when the input changes.
   * @param {Object} e A React event object.
   */
  const handleOnChange = (e) => {
    setQuery(e.target.value);
  };

  /**
   * Queries locations by postal codes.
   * @param {Object} e A React event object.
   */
  const handleOnKeyDown = (e) => {
    if (e.keyCode === 13) {
      getLocationsByPostalCode(productId, query);
    }
  };

  /**
   * Queries locations by geo coordinates.
   */
  const handleLocate = () => {
    getLocationsByGeolocation(productId);
  };

  return (
    <Fragment>
      <div className={container}>
        <div className={search}>
          <span className={icon} aria-hidden>
            <MagnifierIcon />
          </span>
          <input
            className={input}
            value={query}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
            disabled={loading}
            type="search"
            autoComplete="off"
            autoCorrect="off"
            placeholder={i18n.text('product.zip_search')}
          />
          <button onClick={handleLocate} type="button" className={icon}>
            <LocatorIcon />
          </button>
        </div>
      </div>
      <div className={progressBar}>
        <ProgressBar isVisible={loading} />
      </div>
    </Fragment>
  );
}

SearchField.propTypes = {
  getLocationsByGeolocation: PropTypes.func.isRequired,
  getLocationsByPostalCode: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  productId: PropTypes.string,
};

SearchField.defaultProps = {
  productId: null,
  loading: false,
};

export const SearchFieldUnwrapped = SearchField;

export default withCurrentProduct(connect(SearchField));
