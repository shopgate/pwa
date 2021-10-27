import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { I18n, Input, MagnifierIcon } from '@shopgate/engage/components';
import styles from './style';

/**
 * @return {JSX}
 */
const SearchBar = ({ handleChange }) => {
  const [query, setQuery] = useState('');
  const name = 'search';
  return (
    <div className="theme__browse__search-field" data-test-id="SearchField">
      <div className={styles.container}>
        <div className={styles.inputWrapper}>
          <form onSubmit={(e) => {
            e.preventDefault();
          }}
          >
            <label
              htmlFor={name}
              className={styles.label}
            >
              <div className={styles.icon}>
                <MagnifierIcon />
              </div>
              {!query.length && <I18n.Text string="search.placeholder" />}
            </label>
            <Input
              name={name}
              autoComplete={false}
              className={classNames(styles.input)}
              onChange={(value) => {
                handleChange(value);
                setQuery(value);
              }}
              value={query}
              type="search"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default SearchBar;
