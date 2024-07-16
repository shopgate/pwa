import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import Input from '@shopgate/pwa-common/components/Input';
import MagnifierIcon from '../../../../../icons/MagnifierIcon';
import styles from './style';

/**
 * @return {JSX}
 */
const SearchBar = ({ handleChange }) => {
  const [query, setQuery] = useState('');
  const name = 'search';
  return (
    <div className="ui-shared__sheet__search-field" data-test-id="SearchField">
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
