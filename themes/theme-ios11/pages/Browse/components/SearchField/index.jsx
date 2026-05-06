import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import {
  registerEvents,
} from '@shopgate/engage/core/commands';
import {
  i18n,
  router,
} from '@shopgate/engage/core/helpers';
import {
  Trilean,
  EVENT_KEYBOARD_WILL_CHANGE,
} from '@shopgate/engage/core/constants';
import {
  event,
} from '@shopgate/engage/core/classes';
import {
  I18n,
  Input,
  SurroundPortals,
  MagnifierIcon,
  BarcodeScannerIcon,
} from '@shopgate/engage/components';
import { SCANNER_ICON } from '@shopgate/engage/scanner/constants';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import TabBar from 'Components/TabBar';
import SuggestionList from './components/SuggestionList';
import connect from './connector';

const SUGGESTIONS_MIN = 1;

const useStyles = makeStyles()(() => ({
  container: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 4,
    paddingLeft: 16,
    paddingRight: 16,
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
  inputWithScannerIcon: {
    paddingRight: 36,
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
  hidden: {
    display: 'none',
  },
  button: {
    lineHeight: '34px',
    color: 'var(--color-secondary)',
    paddingTop: 0,
    paddingLeft: 16,
    paddingRight: 0,
    marginLeft: 0,
    marginRight: 0,
    verticalAlign: 'middle',
    outline: 0,
  },
  icon: {
    padding: '0 6px',
    color: themeColors.shade11,
    fontSize: '1.235rem',
  },
  scannerIcon: {
    padding: '4px 6px 4px 4px',
    color: themeColors.shade11,
    fontSize: '1.7rem',
    position: 'absolute',
    right: 0,
  },
  overlay: {
    background: themeColors.darkTransparent,
    position: 'absolute',
    left: 0,
    width: '100%',
    top: 124,
    bottom: 0,
    zIndex: 2,
    overflow: 'hidden',
    outline: 'none',
  },
}));

/**
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const SearchField = ({
  fetchSuggestions,
  openScanner,
  pageId,
  submitSearch,
  name = 'search',
  query: queryProp = '',
  showScannerIcon = true,
}) => {
  const { classes, cx } = useStyles();
  const [focused, setFocused] = useState(Trilean.NONE);
  const [bottomHeight, setBottomHeight] = useState(0);
  const initialQuery = queryProp || '';
  const [query, setQuery] = useState(initialQuery);
  const queryRef = useRef(initialQuery);
  const inputRef = useRef(null);

  const fetchSuggestionsDebounced = useMemo(
    () => debounce((q) => {
      if (q.length > SUGGESTIONS_MIN) {
        fetchSuggestions(q);
      }
    }, 200, { maxWait: 400 }),
    [fetchSuggestions]
  );

  useEffect(() => () => fetchSuggestionsDebounced.cancel(), [fetchSuggestionsDebounced]);

  useEffect(() => {
    const next = queryProp || '';
    queryRef.current = next;
    setQuery(next);
  }, [queryProp]);

  useEffect(() => {
    registerEvents([EVENT_KEYBOARD_WILL_CHANGE]);
    /**
     * @param {Object} payload Event payload from keyboard overlap.
     * @param {number} payload.overlap Keyboard overlap height in px.
     */
    const handleKeyboardChange = ({ overlap }) => {
      setBottomHeight(overlap);
    };
    event.addCallback(EVENT_KEYBOARD_WILL_CHANGE, handleKeyboardChange);
    return () => {
      event.removeCallback(EVENT_KEYBOARD_WILL_CHANGE, handleKeyboardChange);
    };
  }, []);

  const setInputRef = useCallback((ref) => {
    inputRef.current = ref;
  }, []);

  const reset = useCallback(() => {
    setTimeout(() => {
      queryRef.current = '';
      setQuery('');
      setFocused(Trilean.NONE);
    }, 0);
  }, []);

  const update = useCallback((value) => {
    const q = value.trim();
    queryRef.current = q;
    fetchSuggestionsDebounced(q);
    setQuery(q);
  }, [fetchSuggestionsDebounced]);

  const handleFocusChange = useCallback((isFocused) => {
    const bufferTimeout = 100;
    if (!isFocused) {
      setTimeout(() => {
        TabBar.show();
      }, bufferTimeout);
    } else {
      TabBar.hide();
    }
    setFocused(isFocused ? Trilean.TRUE : Trilean.FALSE);
  }, []);

  const handleSubmitStable = useCallback((e, searchQuery) => {
    e.preventDefault();
    const fromArg = searchQuery != null ? String(searchQuery).trim() : '';
    const fromDom = inputRef.current && 'value' in inputRef.current
      ? String(inputRef.current.value).trim()
      : '';
    const q = fromArg || fromDom || String(queryRef.current || '').trim();
    if (!q) {
      return;
    }

    router.update(pageId, { query: q });

    setFocused(Trilean.FALSE);
    setTimeout(() => {
      inputRef.current?.blur();
      submitSearch(q);
    }, 0);
  }, [pageId, submitSearch]);

  const inputClassName = cx(
    classes.input,
    showScannerIcon && focused === Trilean.NONE && classes.inputWithScannerIcon
  );

  return (
    <div className="theme__browse__search-field" data-test-id="SearchField">
      <div className={classes.container}>
        <div className={classes.inputWrapper}>
          <form onSubmit={handleSubmitStable} action=".">
            <label
              htmlFor={name}
              className={classes.label}
            >
              <div className={classes.icon}>
                <MagnifierIcon />
              </div>
              {!query.length && <I18n.Text string="search.label" />}
            </label>
            <Input
              autoComplete={false}
              className={inputClassName}
              onFocusChange={handleFocusChange}
              onChange={update}
              onSubmit={handleSubmitStable}
              value={query}
              setRef={setInputRef}
              type="search"
            />
            {showScannerIcon && focused === Trilean.NONE && (
              <SurroundPortals portalName={SCANNER_ICON}>
                <button
                  type="button"
                  className={classes.scannerIcon}
                  data-test-id="search-field-scanner"
                  onClick={openScanner}
                  aria-hidden
                  aria-label={i18n.text('titles.scanner')}
                >
                  <BarcodeScannerIcon />
                </button>
              </SurroundPortals>
            )}
          </form>
        </div>
        <div>
          <button
            type="button"
            data-test-id="search-field-cancel"
            aria-hidden={focused === Trilean.NONE}
            className={cx(classes.button, focused === Trilean.NONE && classes.hidden)}
            onClick={reset}
          >
            <I18n.Text string="search.cancel" />
          </button>
        </div>
      </div>
      {focused !== Trilean.NONE && <div className={classes.overlay} />}
      <SuggestionList
        visible={focused !== Trilean.NONE}
        searchPhrase={query}
        onClick={handleSubmitStable}
        bottomHeight={bottomHeight}
      />
    </div>
  );
};

SearchField.propTypes = {
  fetchSuggestions: PropTypes.func.isRequired,
  openScanner: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  submitSearch: PropTypes.func.isRequired,
  name: PropTypes.string,
  query: PropTypes.string,
  showScannerIcon: PropTypes.bool,
};

SearchField.defaultProps = {
  name: 'search',
  query: '',
  showScannerIcon: true,
};

export default connect(SearchField);
