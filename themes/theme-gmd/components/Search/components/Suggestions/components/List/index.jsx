import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTION_ITEM,
  SEARCH_SUGGESTION_ITEM_CONTENT,
} from '@shopgate/engage/search';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './connector';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  list: {
    fontSize: 14,
    fontWeight: 400,
    marginTop: 4,
    position: 'relative',
  },
  item: {
    alignItems: 'center',
    background: colors.light,
    display: 'flex',
    height: 48,
    marginTop: 2,
    outline: 0,
    padding: '0 16px 0 72px',
    width: '100%',
    textAlign: 'left',
  },
});

/**
 * Mirrors legacy `shouldComponentUpdate` for `memo` (return `true` when props are equal).
 * @param {Object} prev Previous props.
 * @param {Object} next Next props.
 * @returns {boolean}
 */
const suggestionListPropsAreEqual = (prev, next) => {
  const shouldUpdate = (next.fetching === false && next.suggestions)
    || (next.searchPhrase !== prev.searchPhrase);
  return !shouldUpdate;
};

/**
 * The SuggestionList component.
 */
const SuggestionList = memo(({
  onClick,
  searchPhrase,
  suggestions,
}) => {
  const { classes, cx } = useStyles();

  if (!suggestions) {
    return (
      <SurroundPortals
        portalName={SEARCH_SUGGESTIONS}
        portalProps={{
          onClick,
          suggestions,
          searchPhrase,
        }}
      >
        {null}
      </SurroundPortals>
    );
  }

  return (
    <SurroundPortals
      portalName={SEARCH_SUGGESTIONS}
      portalProps={{
        onClick,
        suggestions,
        searchPhrase,
      }}
    >
      <div className={cx(classes.list, 'theme__search__suggestion-list')}>
        {suggestions.map(suggestion => (
          <SurroundPortals
            portalName={SEARCH_SUGGESTION_ITEM}
            portalProps={{
              className: classes.item,
              onClick,
              suggestion,
            }}
            key={suggestion}
          >
            <button
              type="button"
              className={classes.item}
              onClick={onClick}
              value={suggestion}
              data-test-id={`searchSuggestion ${suggestion}`}
            >
              <SurroundPortals
                portalName={SEARCH_SUGGESTION_ITEM_CONTENT}
                portalProps={{ suggestion }}
              >
                {suggestion}
              </SurroundPortals>
            </button>
          </SurroundPortals>
        ))}
      </div>
    </SurroundPortals>
  );
}, suggestionListPropsAreEqual);

SuggestionList.displayName = 'SuggestionList';

SuggestionList.propTypes = {
  onClick: PropTypes.func.isRequired,
  /* Used by suggestionListPropsAreEqual (connected props). */
  // eslint-disable-next-line react/no-unused-prop-types
  fetching: PropTypes.bool,
  searchPhrase: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.string),
};

SuggestionList.defaultProps = {
  fetching: false,
  searchPhrase: null,
  suggestions: [],
};

export { SuggestionList as UnwrappedSuggestionList };

export default connect(SuggestionList);
