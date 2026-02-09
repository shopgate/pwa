import React from 'react';
import PropTypes from 'prop-types';
import { Button, I18n } from '../index';
import { makeStyles } from '../../styles';
import { i18n } from '../../core';

const useStyles = makeStyles()({
  deleteButton: {
    marginTop: 16,
    textDecoration: 'underline',
  },
  listEntry: {
    marginBottom: 8,
  },
  srOnly: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px !important',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
    whiteSpace: 'nowrap',
  },
});

/**
 * SearchHistory Component
 * @param {Object} props The component props.
 * @param {string[]} props.history The search history entries.
 * @param {Function} props.onSelect The action that is triggered when a history entry is selected.
 * @param {Function} props.onClear The action when the clear history button is clicked.
 * @returns {JSX.Element}
 */
const SearchHistory = ({ history, onSelect, onClear }) => {
  const { classes } = useStyles();
  if (!history || history?.length === 0) {
    return null;
  }

  return (
    <div>
      <div className={classes.srOnly}>
        {i18n.text('search.history_announcement')}
      </div>
      <ul>
        {history.map(entry => (
          <li key={entry} className={classes.listEntry}>
            <Button type="plain" onClick={() => onSelect(entry)}>
              {entry}
            </Button>
          </li>
        ))}
      </ul>
      <Button
        type="plain"
        onClick={onClear}
        className={classes.deleteButton}
      >
        <I18n.Text string="search.deleteHistory" />
      </Button>
    </div>
  );
};

SearchHistory.propTypes = {
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClear: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SearchHistory;
