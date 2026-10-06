import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { SurroundPortals, LoadingIndicator } from '@shopgate/engage/components';
import { Button, CircularProgress } from '@shopgate/engage/components/v2';
import { ProductGrid } from '@shopgate/engage/product/components';
import { makeStyles } from '@shopgate/engage/styles';
import { SEARCH_SUGGESTIONS } from '@shopgate/pwa-common-commerce/search/constants/Portals';
import { useSearchPreview, useSearchSuggestions } from '../hooks';
import { SEARCH_MIN_CHARS } from '../constants';

const useStyles = makeStyles()(theme => ({
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
  },
  sectionTitle: {
    fontWeight: 600,
  },
  textButton: {
    border: 0,
    padding: 0,
    background: 'none',
    color: theme.palette.primary.main,
    font: 'inherit',
    textDecoration: 'underline',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  listItem: {
    display: 'block',
    width: '100%',
    border: 0,
    borderBottom: `1px solid ${theme.components.separatorLine.borderColor}`,
    padding: theme.spacing(1.5, 2),
    background: 'none',
    color: 'inherit',
    font: 'inherit',
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
  chip: {
    flexShrink: 0,
    border: `1px solid ${theme.components.separatorLine.borderColor}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.75, 1.5),
    background: 'none',
    color: 'inherit',
    font: 'inherit',
    whiteSpace: 'nowrap',
  },
  highlight: {
    fontWeight: 600,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  empty: {
    padding: theme.spacing(3, 2),
    textAlign: 'center',
  },
  stale: {
    opacity: 0.4,
    transition: 'opacity 150ms ease-in-out',
  },
  inlineLoading: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 32,
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
  const { classes } = useStyles();
  const phrase = query.trim().toLowerCase();
  const entries = phrase ? history.filter(entry => entry.toLowerCase().includes(phrase)) : history;

  if (!entries.length) {
    return null;
  }

  return (
    <section aria-label={i18n.text('search.history_title')}>
      <div className={classes.sectionHeader}>
        <span className={classes.sectionTitle}>{i18n.text('search.history_title')}</span>
        {!phrase && (
          <button type="button" className={classes.textButton} onClick={onClear}>
            {i18n.text('search.history_clear')}
          </button>
        )}
      </div>
      <ul className={classes.list}>
        {entries.map(entry => (
          <li key={entry}>
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
const Results = ({ query, onSelect, onFilter }) => {
  const { classes } = useStyles();
  const phrase = query.trim();
  const suggestions = useSearchSuggestions(phrase);
  const {
    products, totalProductCount, isLoading, isPending,
  } = useSearchPreview(phrase);
  const hasProducts = products.length > 0;
  const isStale = isLoading || isPending;

  return (
    <>
      <SurroundPortals portalName={SEARCH_SUGGESTIONS} portalProps={{ searchPhrase: phrase }}>
        {suggestions.length > 0 && (
          <div className={classes.chips}>
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                className={classes.chip}
                onClick={() => onSelect(suggestion)}
              >
                <Highlighted text={suggestion} phrase={phrase} className={classes.highlight} />
              </button>
            ))}
          </div>
        )}
      </SurroundPortals>
      {totalProductCount !== null && hasProducts && (
        <div className={classes.sectionHeader}>
          {isStale ? (
            <span className={classes.inlineLoading}>
              <CircularProgress size={20} />
            </span>
          ) : (
            <span className={classes.sectionTitle}>
              {i18n.text('search.results_count', { count: totalProductCount })}
            </span>
          )}
          <Button variant="outlined" size="small" onClick={() => onFilter(phrase)}>
            {i18n.text('titles.filter')}
          </Button>
        </div>
      )}
      {!hasProducts && isStale && (
        <div className={classes.loading}>
          <LoadingIndicator />
        </div>
      )}
      {!hasProducts && !isStale && totalProductCount === 0 && (
        <div className={classes.empty}>
          {i18n.text('search.no_result.body', { searchPhrase: phrase })}
        </div>
      )}
      {hasProducts && (
        <div className={isStale ? classes.stale : ''} aria-busy={isStale}>
          <ProductGrid products={products} infiniteLoad={false} />
          {totalProductCount > products.length && (
            <div className={classes.showAll}>
              <Button variant="contained" color="cta" onClick={() => onSelect(phrase)}>
                {i18n.text('search.show_all_results')}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

/**
 * The content of the search overlay.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Content = ({
  query, history, onSelect, onFilter, onClearHistory,
}) => {
  if (query.trim().length < SEARCH_MIN_CHARS) {
    return (
      <History history={history} query={query} onSelect={onSelect} onClear={onClearHistory} />
    );
  }

  return <Results query={query} onSelect={onSelect} onFilter={onFilter} />;
};

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
  onFilter: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

Content.propTypes = {
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClearHistory: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

export default Content;
