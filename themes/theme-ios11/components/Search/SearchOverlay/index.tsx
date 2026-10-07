import {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import type { KeyboardEvent } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentPathname, getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { RouteContext } from '@shopgate/pwa-common/context';
import { registerEvents } from '@shopgate/engage/core/commands';
import { EVENT_KEYBOARD_WILL_CHANGE } from '@shopgate/engage/core/constants';
import { event } from '@shopgate/engage/core/classes';
import { i18n } from '@shopgate/engage/core/helpers';
import { UIEvents } from '@shopgate/engage/core/events';
import { updateStatusBarBackground } from '@shopgate/engage/core/actions';
import { SurroundPortals } from '@shopgate/engage/components';
import { OPEN_SEARCH } from '@shopgate/engage/navigation';
import { SEARCH_OVERLAY, SEARCH_OVERLAY_HEADER } from '@shopgate/engage/search/constants';
import { makeStyles, keyframes, getCSSCustomProp } from '@shopgate/engage/styles';
import SearchField from '../SearchField';
import Content from './Content';
import {
  animateOpen, animateClose, cancelAnimations, setOriginHidden,
} from './animation';
import type { OverlayElements } from './animation';
import {
  useDebouncedValue, useSearchHistory, useSearchPreview, useSubmitSearch,
} from '../hooks';
import { SEARCH_MIN_CHARS } from '../constants';

const loadingSweep = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(250%)' },
});

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.primary,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
    background: theme.palette.background.default,
  },
  header: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexShrink: 0,
    overflow: 'hidden',
    padding: theme.spacing(1, 2),
    paddingTop: `calc(${theme.layout.safeArea.top} + ${theme.spacing(1)}px)`,
    color: theme.components.appBar.color,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
    background: theme.components.appBar.background,
  },
  fieldWrapper: {
    display: 'flex',
    flexGrow: 1,
    minWidth: 0,
  },
  cancel: {
    flexShrink: 0,
    border: 0,
    padding: theme.spacing(1, 0, 1, 1),
    background: 'none',
    color: 'inherit',
    font: 'inherit',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    overflow: 'hidden',
    opacity: 0,
    transition: theme.transitions.create('opacity', { duration: 150 }),
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '40%',
      background: 'currentColor',
      opacity: 0.5,
      '@media (prefers-reduced-motion: no-preference)': {
        animation: `${loadingSweep} 1.1s ease-in-out infinite`,
      },
    },
  },
  loadingVisible: {
    opacity: 1,
  },
  body: {
    flexGrow: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
}));

type Dispatch = ReturnType<typeof useDispatch>;

interface OpenPayload {
  query?: string;
  /** The field that opened the search. The overlay grows out of it. */
  origin?: HTMLElement | null;
}

/**
 * Syncs the native status bar with the header of the search, or with the page below it.
 * @param dispatch The redux dispatch function.
 * @param isOpen Whether the search is open.
 */
const syncStatusBar = (dispatch: Dispatch, isOpen: boolean) => {
  const header = document.getElementById('AppHeader');
  const background = !isOpen && header && 'overlay' in header.dataset
    ? 'transparent'
    : getCSSCustomProp('--sg-components-appBar-background');
  dispatch(updateStatusBarBackground(background) as never);
};

/**
 * Takes the app below the search out of reach of keyboard and screen readers.
 * @param inert Whether the app is out of reach.
 */
const setAppInert = (inert: boolean) => {
  document.getElementById('root')?.toggleAttribute('inert', inert);
};

/**
 * The search with history, suggestions and the first results. Opened by every search field and by
 * the header action.
 * @returns The search, or nothing while it is closed.
 */
const SearchOverlay = () => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const pathname = useSelector(getCurrentPathname) as string;
  const route = useSelector(getCurrentRoute);
  const { history, addTerm, clearHistory } = useSearchHistory();
  const { submit, submitWithFilters } = useSubmitSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [query, setQuery] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const searchPhrase = useDebouncedValue(query.trim(), openCount);
  const preview = useSearchPreview(searchPhrase);
  const inputRef = useRef<HTMLInputElement>(null);
  const openedOnRef = useRef<string | null>(null);
  const originRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(0);
  const elementsRef = useRef<OverlayElements>({});

  const close = useCallback((returnFocus = true) => {
    setOriginHidden(originRef.current, false);
    setAppInert(false);
    setIsOpen(false);
    openedOnRef.current = null;
    closingRef.current = 0;

    if (returnFocus && returnFocusRef.current?.isConnected) {
      returnFocusRef.current.focus();
    }
    returnFocusRef.current = null;
  }, []);

  const closeAnimated = useCallback(() => {
    if (closingRef.current) {
      return;
    }

    const generation = Date.now();
    closingRef.current = generation;
    inputRef.current?.blur();
    syncStatusBar(dispatch, false);
    animateClose(elementsRef.current, originRef.current).then(() => {
      if (closingRef.current === generation) {
        close();
      }
    });
  }, [close, dispatch]);

  useEffect(() => {
    /**
     * @param payload The query and the field that opened the search.
     */
    const handleOpen = (payload?: OpenPayload) => {
      const active = document.activeElement as HTMLElement | null;
      cancelAnimations(elementsRef.current);
      setOriginHidden(originRef.current, false);
      originRef.current = payload?.origin || null;
      returnFocusRef.current = returnFocusRef.current
        || (active && active !== document.body ? active : null)
        || originRef.current?.querySelector('button')
        || null;
      closingRef.current = 0;
      setQuery(payload?.query || '');
      setOpenCount(count => count + 1);
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
     * @param payload The keyboard event payload.
     * @param payload.overlap Height of the keyboard over the content.
     * @returns Nothing.
     */
    const handleKeyboardChange = ({ overlap }: { overlap: number }) => setKeyboardHeight(overlap);
    event.addCallback(EVENT_KEYBOARD_WILL_CHANGE, handleKeyboardChange);
    return () => {
      event.removeCallback(EVENT_KEYBOARD_WILL_CHANGE, handleKeyboardChange);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    setAppInert(true);
    inputRef.current?.focus();
    syncStatusBar(dispatch, true);
    animateOpen(elementsRef.current, originRef.current);
  }, [dispatch, isOpen, openCount]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!openedOnRef.current) {
      openedOnRef.current = pathname;
    } else if (openedOnRef.current !== pathname) {
      close(false);
    }
  }, [close, isOpen, pathname]);

  useEffect(() => () => {
    setOriginHidden(originRef.current, false);
    setAppInert(false);
  }, []);

  const handleSelect = useCallback((term: string) => {
    const phrase = term.trim();
    if (!phrase) {
      return;
    }

    inputRef.current?.blur();
    addTerm(phrase);
    close(false);
    submit(phrase);
  }, [addTerm, close, submit]);

  const handleFilter = useCallback((phrase: string) => {
    inputRef.current?.blur();
    addTerm(phrase);
    close(false);
    submitWithFilters(phrase);
  }, [addTerm, close, submitWithFilters]);

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((keyEvent: KeyboardEvent) => {
    if (keyEvent.key === 'Escape') {
      keyEvent.preventDefault();
      closeAnimated();
    }
  }, [closeAnimated]);

  if (!isOpen) {
    return null;
  }

  const isLoading = query.trim().length >= SEARCH_MIN_CHARS
    && (preview.isLoading || searchPhrase !== query.trim());

  return ReactDOM.createPortal(
    <SurroundPortals portalName={SEARCH_OVERLAY} portalProps={{ query }}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className={cx(classes.root, 'theme__search-overlay')}
        role="dialog"
        aria-modal="true"
        aria-label={i18n.text('search.label')}
        onKeyDown={handleKeyDown}
        data-loading={isLoading ? true : undefined}
        data-test-id="SearchOverlay"
      >
        <div
          className={cx(classes.backdrop, 'theme__search-overlay__backdrop')}
          ref={(node) => { elementsRef.current.backdrop = node; }}
        />
        <div className={cx(classes.header, 'theme__search-overlay__header')}>
          <div
            className={classes.headerBackground}
            ref={(node) => { elementsRef.current.headerBackground = node; }}
          />
          <SurroundPortals
            portalName={SEARCH_OVERLAY_HEADER}
            portalProps={{
              query,
              onChange: setQuery,
              onSubmit: handleSelect,
              onCancel: closeAnimated,
            }}
          >
            <div
              className={classes.fieldWrapper}
              ref={(node) => { elementsRef.current.field = node; }}
            >
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
              className={cx(classes.cancel, 'theme__search-overlay__cancel')}
              onClick={closeAnimated}
              ref={(node) => { elementsRef.current.cancel = node; }}
              data-test-id="search-field-cancel"
            >
              {i18n.text('search.cancel')}
            </button>
          </SurroundPortals>
          <div
            className={cx(
              classes.loading,
              isLoading && classes.loadingVisible,
              'theme__search-overlay__loading'
            )}
            aria-hidden
          />
        </div>
        <div
          className={cx(classes.body, 'theme__search-overlay__body')}
          style={{ paddingBottom: keyboardHeight }}
          ref={(node) => { elementsRef.current.body = node; }}
        >
          <RouteContext.Provider value={route}>
            <Content
              query={query}
              searchPhrase={searchPhrase}
              preview={preview}
              history={history}
              onSelect={handleSelect}
              onFilter={handleFilter}
              onClearHistory={clearHistory}
            />
          </RouteContext.Provider>
        </div>
      </div>
    </SurroundPortals>,
    document.body
  );
};

export default SearchOverlay;
