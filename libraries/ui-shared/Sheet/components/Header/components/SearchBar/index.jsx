import React, { useState } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Input from '@shopgate/pwa-common/components/Input';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import MagnifierIcon from '../../../../../icons/MagnifierIcon';

const useStyles = makeStyles()({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 4,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 5,
    paddingBottom: 10,
  },
  inputWrapper: {
    position: 'relative',
    flexGrow: 1,
  },
  input: {
    borderRadius: 10,
    width: '100%',
    padding: '4px 10px 4px 30px',
    lineHeight: '28px',
    outline: 'none',
    background: themeColors.shade7,
    verticalAlign: 'middle',
    WebkitAppearance: 'none',
  },
  label: {
    alignItems: 'center',
    color: themeColors.shade3,
    display: 'flex',
    height: '36px',
    position: 'absolute',
    pointerEvents: 'none',
    width: '100%',
  },
  icon: {
    padding: '0 6px',
    color: themeColors.shade3,
    fontSize: '1.235rem',
  },
});

/**
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const SearchBar = ({ handleChange }) => {
  const { classes } = useStyles();
  const [query, setQuery] = useState('');
  const name = 'search';

  return (
    <div className="ui-shared__sheet__search-field" data-test-id="SearchField">
      <div className={classes.container}>
        <div className={classes.inputWrapper}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label
              htmlFor={name}
              className={classes.label}
            >
              <div className={classes.icon}>
                <MagnifierIcon />
              </div>
              {!query.length && <I18n.Text string="search.placeholder" />}
            </label>
            <Input
              name={name}
              autoComplete={false}
              className={classes.input}
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
