import React, {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentPathname, getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { RouteContext } from '@shopgate/pwa-common/context';
import { registerEvents } from '@shopgate/engage/core/commands';
import { EVENT_KEYBOARD_WILL_CHANGE } from '@shopgate/engage/core/constants';
import { event } from '@shopgate/engage/core/classes';
import { i18n } from '@shopgate/engage/core/helpers';
import { UIEvents } from '@shopgate/engage/core/events';
import { OPEN_SEARCH } from '@shopgate/engage/navigation';
import { makeStyles } from '@shopgate/engage/styles';
import TabBar from 'Components/TabBar';
import SearchField from '../SearchField';
import Content from './Content';
import { animateOpen, animateClose } from './animation';
import { useSearchHistory } from '../hooks';
import { submitSearch, submitSearchWithFilters } from '../actions';

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.primary,
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    background: theme.palette.background.default,
  },
  fieldWrapper: {
    display: 'flex',
    flexGrow: 1,
    minWidth: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexShrink: 0,
    padding: theme.spacing(1, 2),
    paddingTop: `calc(${theme.layout.safeArea.top} + ${theme.spacing(1)}px)`,
    borderBottom: `1px solid ${theme.components.separatorLine.borderColor}`,
  },
  cancel: {
    flexShrink: 0,
    border: 0,
    padding: theme.spacing(1, 0, 1, 1),
    background: 'none',
    color: theme.palette.secondary.main,
    font: 'inherit',
  },
  body: {
    flexGrow: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
}));

/**
 * The search with history, suggestions and the first results. Opened by every search field and by
 * the header action.
 * @returns {JSX.Element|null}
 */
const SearchOverlay = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const pathname = useSelector(getCurrentPathname);
  const route = useSelector(getCurrentRoute);
  const { history, addTerm, clearHistory } = useSearchHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef(null);
  const openedOnRef = useRef(null);
  const originRef = useRef(null);
  const closingRef = useRef(false);
  const elementsRef = useRef({});

  const close = useCallback(() => {
    setIsOpen(false);
    openedOnRef.current = null;
    closingRef.current = false;
  }, []);

  const closeAnimated = useCallback(() => {
    if (closingRef.current) {
      return;
    }

    closingRef.current = true;
    inputRef.current?.blur();
    animateClose(elementsRef.current, originRef.current).then(close);
  }, [close]);

  useEffect(() => {
    /**
     * @param {Object} payload The query and the position of the field that opened the search.
     */
    const handleOpen = (payload) => {
      originRef.current = payload?.origin || null;
      closingRef.current = false;
      setQuery(payload?.query || '');
      setIsOpen(true);
    };

    UIEvents.addListener(OPEN_SEARCH, handleOpen);
    return () => {
      UIEvents.removeListener(OPEN_SEARCH, handleOpen);
    };
  }, []);

  useEffect(() => {
    registerEvents([EVENT_KEYBOARD_WILL_CHANGE]);
    /**
     * @param {Object} payload The keyboard event payload.
     * @param {number} payload.overlap Height of the keyboard over the content.
     * @returns {void}
     */
    const handleKeyboardChange = ({ overlap }) => setKeyboardHeight(overlap);
    event.addCallback(EVENT_KEYBOARD_WILL_CHANGE, handleKeyboardChange);
    return () => {
      event.removeCallback(EVENT_KEYBOARD_WILL_CHANGE, handleKeyboardChange);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    openedOnRef.current = pathname;
    inputRef.current?.focus();
    TabBar.hide();
    animateOpen(elementsRef.current, originRef.current);

    return () => {
      TabBar.show();
    };
    // Focus once per opening, a route change closes the overlay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && openedOnRef.current && openedOnRef.current !== pathname) {
      close();
    }
  }, [close, isOpen, pathname]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    /**
     * @param {KeyboardEvent} keyEvent The key event.
     */
    const handleKeyDown = (keyEvent) => {
      if (keyEvent.key === 'Escape') {
        closeAnimated();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeAnimated, isOpen]);

  const handleSelect = useCallback((term) => {
    const phrase = term.trim();
    if (!phrase) {
      return;
    }

    inputRef.current?.blur();
    addTerm(phrase);
    close();
    dispatch(submitSearch(phrase));
  }, [addTerm, close, dispatch]);

  const handleFilter = useCallback((phrase) => {
    inputRef.current?.blur();
    addTerm(phrase);
    close();
    dispatch(submitSearchWithFilters(phrase));
  }, [addTerm, close, dispatch]);

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className={classes.root}
      role="dialog"
      aria-modal="true"
      aria-label={i18n.text('search.label')}
      data-test-id="SearchOverlay"
    >
      <div className={classes.backdrop} ref={(node) => { elementsRef.current.backdrop = node; }} />
      <div className={classes.header} ref={(node) => { elementsRef.current.header = node; }}>
        <div className={classes.fieldWrapper} ref={(node) => { elementsRef.current.field = node; }}>
          <SearchField
            inputRef={inputRef}
            value={query}
            onChange={setQuery}
            onSubmit={handleSelect}
            onClear={handleClear}
          />
        </div>
        <button
          type="button"
          className={classes.cancel}
          onClick={closeAnimated}
          ref={(node) => { elementsRef.current.cancel = node; }}
          data-test-id="search-field-cancel"
        >
          {i18n.text('search.cancel')}
        </button>
      </div>
      <div
        className={classes.body}
        style={{ paddingBottom: keyboardHeight }}
        ref={(node) => { elementsRef.current.body = node; }}
      >
        <RouteContext.Provider value={route}>
          <Content
            query={query}
            history={history}
            onSelect={handleSelect}
            onFilter={handleFilter}
            onClearHistory={clearHistory}
          />
        </RouteContext.Provider>
      </div>
    </div>,
    document.body
  );
};

export default SearchOverlay;
