import { useEffect, useRef } from 'react';
import type { ComponentType, MouseEvent } from 'react';
import { broadcastLiveMessage as broadcast } from '@shopgate/engage/a11y';
import { i18n } from '@shopgate/engage/core/helpers';
import {
  SurroundPortals, Typography, NoResults as UntypedNoResults,
} from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { ProductGrid } from '@shopgate/engage/product/components';
import { makeStyles, keyframes } from '@shopgate/engage/styles';
import {
  SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTION_ITEM,
  SEARCH_SUGGESTION_ITEM_CONTENT,
  SEARCH_OVERLAY_HISTORY,
  SEARCH_OVERLAY_NO_RESULTS,
  SEARCH_OVERLAY_RESULTS,
} from '@shopgate/engage/search/constants';
import { useSearchSuggestions } from '../hooks';
import type { SearchPreview } from '../hooks';
import { SEARCH_MIN_CHARS } from '../constants';

const broadcastLiveMessage = broadcast as unknown as (
  message: string,
  options: { params: Record<string, number | string> }
) => void;

const NoResults = UntypedNoResults as unknown as ComponentType<Record<string, unknown>>;

const STAGGER_STEP = 25;
const STAGGER_ITEMS = 8;

const enter = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateY(8px)',
  },
  '100%': {
    opacity: 1,
    transform: 'none',
  },
});

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

/**
 * Staggers an entrance.
 * @param selector The selector of the animated children.
 * @returns Styles that let the first children enter one after another.
 */
const staggered = (selector: string) => ({
  '@media (prefers-reduced-motion: no-preference)': {
    [`& ${selector}`]: {
      animation: `${enter} 180ms ease-out both`,
    },
    ...Object.fromEntries(Array.from({ length: STAGGER_ITEMS }, (_, index) => [
      `& ${selector}:nth-of-type(${index + 1})`,
      { animationDelay: `${index * STAGGER_STEP}ms` },
    ])),
    [`& ${selector}:nth-of-type(n+${STAGGER_ITEMS + 1})`]: {
      animationDelay: `${STAGGER_ITEMS * STAGGER_STEP}ms`,
    },
  },
});

const useStyles = makeStyles()(theme => ({
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    minHeight: 48,
    padding: theme.spacing(1, 2),
  },
  clearHistory: {
    color: theme.palette.text.secondary,
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    background: theme.palette.background.surface,
  },
  listEntering: staggered('li'),
  listItem: {
    display: 'block',
    width: '100%',
    border: 0,
    borderBottom: `1px solid ${theme.components.separatorLine.borderColor}`,
    padding: theme.spacing(1.5, 2),
    background: 'none',
    color: 'inherit',
    ...theme.typography.body1,
    textAlign: 'left',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  chips: {
    display: 'flex',
    gap: theme.spacing(1),
    overflowX: 'auto',
    padding: theme.spacing(1.5, 2, 0.5),
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  chipsEntering: staggered('.theme__search-overlay__suggestion'),
  chip: {
    flexShrink: 0,
    border: 0,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.75, 1.5),
    background: theme.palette.background.emphasized,
    color: theme.palette.text.primary,
    ...theme.typography.body2,
    whiteSpace: 'nowrap',
  },
  highlight: {
    fontWeight: theme.typography.fontWeightBold,
  },
  count: {
    '@media (prefers-reduced-motion: no-preference)': {
      animation: `${fadeIn} 120ms ease-out both`,
    },
  },
  results: {
    transition: theme.transitions.create('opacity', { duration: 150 }),
  },
  resultsEntering: staggered('li'),
  stale: {
    opacity: 0.4,
  },
  showAll: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
}));

interface HighlightedProps {
  text: string;
  phrase: string;
  className: string;
}

/**
 * Highlights the typed part of a suggestion.
 * @param props The component props.
 * @param props.text The suggestion.
 * @param props.phrase The typed phrase.
 * @param props.className The class of the highlighted part.
 * @returns The suggestion.
 */
const Highlighted = ({ text, phrase, className }: HighlightedProps) => {
  const index = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (!phrase || index === -1) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, index)}
      <span className={className}>{text.slice(index, index + phrase.length)}</span>
      {text.slice(index + phrase.length)}
    </>
  );
};

interface HistoryProps {
  history: string[];
  query: string;
  onSelect: (term: string) => void;
  onClear: () => void;
}

/**
 * The recent searches.
 * @param props The component props.
 * @param props.history The search terms.
 * @param props.query The typed text, which filters the terms.
 * @param props.onSelect Runs a term.
 * @param props.onClear Clears the history.
 * @returns The list, or nothing without matching entries.
 */
const History = ({
  history, query, onSelect, onClear,
}: HistoryProps) => {
  const { classes, cx } = useStyles();
  const phrase = query.trim().toLowerCase();
  const entries = phrase ? history.filter(entry => entry.toLowerCase().includes(phrase)) : history;

  if (!entries.length) {
    return null;
  }

  return (
    <SurroundPortals
      portalName={SEARCH_OVERLAY_HISTORY}
      portalProps={{
        entries,
        query,
        onSelect,
        onClear,
      }}
    >
      <section aria-label={i18n.text('search.history_title')} className="theme__search-overlay__history">
        <div className={cx(classes.sectionHeader, 'theme__search-overlay__section-header')}>
          <Typography variant="subtitle2" component="h2">
            {i18n.text('search.history_title')}
          </Typography>
          {!phrase && (
            <Button
              variant="link"
              size="small"
              color="inherit"
              className={classes.clearHistory}
              onClick={onClear}
            >
              {i18n.text('search.history_clear')}
            </Button>
          )}
        </div>
        <ul className={cx(classes.list, classes.listEntering)}>
          {entries.map(entry => (
            <li key={entry} className="theme__search-overlay__history-item">
              <button
                type="button"
                className={classes.listItem}
                onClick={() => onSelect(entry)}
              >
                {entry}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </SurroundPortals>
  );
};

interface ResultsProps {
  searchPhrase: string;
  isPending: boolean;
  preview: SearchPreview;
  onSelect: (term: string) => void;
  onFilter: (term: string) => void;
}

/**
 * Suggestions, result count, filter shortcut and the first products of a search.
 * @param props The component props.
 * @param props.searchPhrase The debounced search phrase.
 * @param props.isPending Whether the typed text is ahead of the search phrase.
 * @param props.preview The first products.
 * @param props.onSelect Runs a search.
 * @param props.onFilter Runs a search and opens its filters.
 * @returns The results.
 */
const Results = ({
  searchPhrase, isPending, preview, onSelect, onFilter,
}: ResultsProps) => {
  const { classes, cx } = useStyles();
  const suggestions = useSearchSuggestions(searchPhrase);
  const { products, totalProductCount, isLoading } = preview;
  const hasProducts = products.length > 0;
  const isStale = isLoading || isPending;
  const enteredRef = useRef(false);
  const shouldEnter = hasProducts && !enteredRef.current;
  if (hasProducts) {
    enteredRef.current = true;
  }

  const settledCount = isStale ? null : totalProductCount;

  useEffect(() => {
    if (settledCount === null) {
      return;
    }

    broadcastLiveMessage(settledCount === 0 ? 'search.no_result.body' : 'search.results_count', {
      params: {
        count: settledCount,
        searchPhrase,
      },
    });
  }, [searchPhrase, settledCount]);

  /**
   * @param _ The click event.
   * @param suggestion The suggestion.
   * @returns Nothing.
   */
  const handleSuggestionClick = (_: MouseEvent | null, suggestion: string) => onSelect(suggestion);

  return (
    <div className="theme__search-overlay__results">
      <SurroundPortals
        portalName={SEARCH_SUGGESTIONS}
        portalProps={{
          suggestions,
          searchPhrase,
          visible: true,
          bottomHeight: 0,
          onClick: handleSuggestionClick,
        }}
      >
        {suggestions.length > 0 && (
          <div className={cx(classes.chips, classes.chipsEntering, 'theme__search-overlay__suggestions', 'theme__browse__search-field__suggestion-list')}>
            {suggestions.map(suggestion => (
              <SurroundPortals
                key={suggestion}
                portalName={SEARCH_SUGGESTION_ITEM}
                portalProps={{
                  suggestion,
                  onClick: handleSuggestionClick,
                }}
              >
                <button
                  type="button"
                  className={cx(classes.chip, 'theme__search-overlay__suggestion')}
                  onClick={event => handleSuggestionClick(event, suggestion)}
                >
                  <SurroundPortals
                    portalName={SEARCH_SUGGESTION_ITEM_CONTENT}
                    portalProps={{ suggestion }}
                  >
                    <Highlighted
                      text={suggestion}
                      phrase={searchPhrase}
                      className={classes.highlight}
                    />
                  </SurroundPortals>
                </button>
              </SurroundPortals>
            ))}
          </div>
        )}
      </SurroundPortals>
      {totalProductCount !== null && hasProducts && (
        <div className={cx(classes.sectionHeader, 'theme__search-overlay__section-header')}>
          <Typography
            key={totalProductCount}
            variant="subtitle2"
            component="p"
            className={cx(classes.count, 'theme__search-overlay__result-count')}
          >
            {i18n.text('search.results_count', { count: totalProductCount })}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            className="theme__search-overlay__filter"
            onClick={() => onFilter(searchPhrase)}
          >
            {i18n.text('titles.filter')}
          </Button>
        </div>
      )}
      {!hasProducts && !isStale && totalProductCount === 0 && (
        <SurroundPortals portalName={SEARCH_OVERLAY_NO_RESULTS} portalProps={{ searchPhrase }}>
          <NoResults
            headlineText="search.no_result.heading"
            bodyText="search.no_result.body"
            searchPhrase={searchPhrase}
          />
        </SurroundPortals>
      )}
      {hasProducts && (
        <SurroundPortals
          portalName={SEARCH_OVERLAY_RESULTS}
          portalProps={{
            searchPhrase,
            products,
            totalProductCount,
            onShowAll: () => onSelect(searchPhrase),
          }}
        >
          <div
            className={cx(
              classes.results,
              shouldEnter && classes.resultsEntering,
              isStale && classes.stale,
              'theme__search-overlay__preview'
            )}
            aria-busy={isStale}
          >
            <ProductGrid products={products} infiniteLoad={false} />
            {(totalProductCount ?? 0) > products.length && (
              <div className={cx(classes.showAll, 'theme__search-overlay__show-all')}>
                <Button variant="contained" color="cta" onClick={() => onSelect(searchPhrase)}>
                  {i18n.text('search.show_all_results')}
                </Button>
              </div>
            )}
          </div>
        </SurroundPortals>
      )}
    </div>
  );
};

interface Props {
  query: string;
  searchPhrase: string;
  preview: SearchPreview;
  history: string[];
  onSelect: (term: string) => void;
  onFilter: (term: string) => void;
  onClearHistory: () => void;
}

/**
 * The content of the search overlay.
 * @param props The component props.
 * @param props.query The typed text.
 * @param props.searchPhrase The debounced search phrase.
 * @param props.preview The first products.
 * @param props.history The search terms.
 * @param props.onSelect Runs a search.
 * @param props.onFilter Runs a search and opens its filters.
 * @param props.onClearHistory Clears the history.
 * @returns The history, or the results from three characters on.
 */
const Content = ({
  query, searchPhrase, preview, history, onSelect, onFilter, onClearHistory,
}: Props) => {
  if (query.trim().length < SEARCH_MIN_CHARS) {
    return (
      <History history={history} query={query} onSelect={onSelect} onClear={onClearHistory} />
    );
  }

  return (
    <Results
      searchPhrase={searchPhrase}
      isPending={searchPhrase !== query.trim()}
      preview={preview}
      onSelect={onSelect}
      onFilter={onFilter}
    />
  );
};

export default Content;
