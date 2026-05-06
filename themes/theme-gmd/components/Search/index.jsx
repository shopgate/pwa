import React, {
  useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { UIEvents } from '@shopgate/pwa-core';
import { SEARCH_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import { makeStyles } from '@shopgate/engage/styles';
import AppBar from './components/AppBar';
import Backdrop from './components/Backdrop';
import Suggestions from './components/Suggestions';
import { TOGGLE_SEARCH, SEARCH_CLOSED } from './constants';
import connect from './connector';

const DEFAULT_QUERY = '';
const SUGGESTIONS_MIN = 1;

const useStyles = makeStyles()({
  root: {
    bottom: 0,
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 4,
  },
});

/**
 * The Search component.
 * @param {Object} props Component props.
 * @param {Function} props.fetchSuggestions Fetches suggestions for a query.
 * @param {Function} props.historyPush history.push wrapper.
 * @param {Function} props.historyReplace history.replace wrapper.
 * @param {Object|null} props.route Current route.
 * @returns {JSX.Element|null}
 */
const Search = ({
  fetchSuggestions,
  historyPush,
  historyReplace,
  route,
}) => {
  const { classes } = useStyles();
  const fieldRef = useRef(null);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [visible, setVisible] = useState(false);

  const fetchSuggestionsDebounced = useMemo(
    () => debounce((q) => {
      if (q.length > SUGGESTIONS_MIN) {
        fetchSuggestions(q.trim());
      }
    }, 200, { maxWait: 400 }),
    [fetchSuggestions]
  );

  useEffect(() => () => {
    fetchSuggestionsDebounced.cancel();
  }, [fetchSuggestionsDebounced]);

  const toggle = useCallback((nextVisible = true) => {
    if (!route) {
      return;
    }

    const routeQuery = route.query;

    setVisible((prevVisible) => {
      if (prevVisible && !nextVisible) {
        UIEvents.emit(SEARCH_CLOSED);
      }
      return nextVisible;
    });

    setQuery(prev => routeQuery.s || prev);
  }, [route]);

  useEffect(() => {
    UIEvents.on(TOGGLE_SEARCH, toggle);
    return () => {
      UIEvents.off(TOGGLE_SEARCH, toggle);
    };
  }, [toggle]);

  useLayoutEffect(() => {
    if (visible && fieldRef.current) {
      fieldRef.current.value = query;
      fieldRef.current.focus();
    }
  }, [visible, query]);

  const close = useCallback(() => {
    toggle(false);
  }, [toggle]);

  const reset = useCallback(() => {
    if (fieldRef.current) {
      fieldRef.current.value = DEFAULT_QUERY;
    }
    setQuery(DEFAULT_QUERY);
  }, []);

  const update = useCallback((event) => {
    const nextQuery = event.currentTarget.value;
    fetchSuggestionsDebounced(nextQuery);
    setQuery(nextQuery);
  }, [fetchSuggestionsDebounced]);

  const fetchResults = useCallback((event) => {
    event.preventDefault();

    const searchQuery = (event.currentTarget.value || query).trim();

    if (searchQuery.length === 0) {
      return;
    }

    setQuery(DEFAULT_QUERY);
    setVisible(false);

    const location = `/search?s=${encodeURIComponent(searchQuery)}`;
    const { pattern, query: routeQuery } = route;

    if (routeQuery.s === searchQuery) {
      return;
    }

    if (pattern === SEARCH_PATTERN) {
      historyReplace({ pathname: location });
    } else {
      historyPush({ pathname: location });
    }
  }, [query, route, historyPush, historyReplace]);

  if (!visible) {
    return null;
  }

  return (
    <div className={classes.root}>
      <AppBar
        close={close}
        reset={reset}
        onInput={update}
        onEnter={fetchResults}
        fieldRef={fieldRef}
      />
      <Backdrop onClick={close} />
      <Suggestions onClick={fetchResults} searchPhrase={query} />
    </div>
  );
};

Search.propTypes = {
  fetchSuggestions: PropTypes.func.isRequired,
  historyPush: PropTypes.func.isRequired,
  historyReplace: PropTypes.func.isRequired,
  route: PropTypes.shape(),
};

Search.defaultProps = {
  route: null,
};

export default connect(Search);
