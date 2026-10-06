import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { SurroundPortals, Typography, NoResults } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { ProductGrid } from '@shopgate/engage/product/components';
import { makeStyles, keyframes } from '@shopgate/engage/styles';
import {
  SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTION_ITEM,
  SEARCH_SUGGESTION_ITEM_CONTENT,
} from '@shopgate/engage/search/constants';
import { useSearchSuggestions } from '../hooks';
import { SEARCH_MIN_CHARS } from '../constants';

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
 * @param {string} selector The selector of the animated children.
 * @returns {Object} Styles that let the first children enter one after another.
 */
const staggered = selector => ({
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

/**
 * Highlights the typed part of a suggestion.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Highlighted = ({ text, phrase, className }) => {
  const index = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (!phrase || index === -1) {
    return text;
  }

  return (
    <>
      {text.slice(0, index)}
      <span className={className}>{text.slice(index, index + phrase.length)}</span>
      {text.slice(index + phrase.length)}
    </>
  );
};

/**
 * The recent searches.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const History = ({
  history, query, onSelect, onClear,
}) => {
  const { classes, cx } = useStyles();
  const phrase = query.trim().toLowerCase();
  const entries = phrase ? history.filter(entry => entry.toLowerCase().includes(phrase)) : history;

  if (!entries.length) {
    return null;
  }

  return (
    <section aria-label={i18n.text('search.history_title')} className="theme__search-overlay__history">
      <div className={classes.sectionHeader}>
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
            <button type="button" className={classes.listItem} onClick={() => onSelect(entry)}>
              {entry}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

/**
 * Suggestions, result count, filter shortcut and the first products of a search.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Results = ({
  searchPhrase, isPending, preview, onSelect, onFilter,
}) => {
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

  /**
   * @param {Event} event The click event.
   * @param {string} suggestion The suggestion.
   * @returns {void}
   */
  const handleSuggestionClick = (event, suggestion) => onSelect(suggestion);

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
        <div className={classes.sectionHeader}>
          <Typography
            key={totalProductCount}
            variant="subtitle2"
            component="p"
            className={classes.count}
          >
            {i18n.text('search.results_count', { count: totalProductCount })}
          </Typography>
          <Button variant="outlined" size="small" color="inherit" onClick={() => onFilter(searchPhrase)}>
            {i18n.text('titles.filter')}
          </Button>
        </div>
      )}
      {!hasProducts && !isStale && totalProductCount === 0 && (
        <NoResults
          headlineText="search.no_result.heading"
          bodyText="search.no_result.body"
          searchPhrase={searchPhrase}
        />
      )}
      {hasProducts && (
        <div
          className={cx(
            classes.results,
            shouldEnter && classes.resultsEntering,
            isStale && classes.stale
          )}
          aria-busy={isStale}
        >
          <ProductGrid products={products} infiniteLoad={false} />
          {totalProductCount > products.length && (
            <div className={classes.showAll}>
              <Button variant="contained" color="cta" onClick={() => onSelect(searchPhrase)}>
                {i18n.text('search.show_all_results')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * The content of the search overlay.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Content = ({
  query, searchPhrase, preview, history, onSelect, onFilter, onClearHistory,
}) => {
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

const previewShape = PropTypes.shape({
  isLoading: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.shape()),
  totalProductCount: PropTypes.number,
});

Highlighted.propTypes = {
  className: PropTypes.string.isRequired,
  phrase: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

History.propTypes = {
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClear: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

Results.propTypes = {
  isPending: PropTypes.bool.isRequired,
  onFilter: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  preview: previewShape.isRequired,
  searchPhrase: PropTypes.string.isRequired,
};

Content.propTypes = {
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClearHistory: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  preview: previewShape.isRequired,
  query: PropTypes.string.isRequired,
  searchPhrase: PropTypes.string.isRequired,
};

export default Content;
