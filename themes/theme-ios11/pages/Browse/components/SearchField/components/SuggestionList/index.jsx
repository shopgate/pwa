import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTION_ITEM,
  SEARCH_SUGGESTION_ITEM_CONTENT,
} from '@shopgate/engage/search/constants';
import connect from './connector';

const { colors } = themeConfig;

const useStyles = makeStyles()((theme, { bottomHeight }) => ({
  list: {
    fontSize: 16,
    fontWeight: 400,
    marginTop: 4,
    bottom: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 120,
    backgroundColor: colors.light,
    overflowY: 'scroll',
    zIndex: 3,
    paddingTop: 5,
    ...typeof bottomHeight === 'number' && {
      paddingBottom: bottomHeight,
    },
  },
  item: {
    alignItems: 'center',
    background: colors.light,
    display: 'flex',
    marginTop: 2,
    outline: 0,
    padding: '10px 16px 10px 46px',
    width: '100%',
    textAlign: 'left',
  },
}));

/**
 * Suggestion list component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const SuggestionList = ({
  bottomHeight,
  onClick,
  searchPhrase,
  suggestions,
  visible,
}) => {
  const { classes, cx } = useStyles({ bottomHeight });

  if (!visible) {
    return null;
  }

  const portalProps = {
    onClick,
    suggestions,
    searchPhrase,
    visible,
    bottomHeight,
  };

  if (!suggestions) {
    return (
      <SurroundPortals
        portalName={SEARCH_SUGGESTIONS}
        portalProps={portalProps}
      >
        {null}
      </SurroundPortals>
    );
  }

  return (
    <SurroundPortals
      portalName={SEARCH_SUGGESTIONS}
      portalProps={portalProps}
    >
      <div
        className={cx(
          'theme__browse__search-field__suggestion-list',
          classes.list
        )}
      >
        {suggestions.map(suggestion => (
          <SurroundPortals
            portalName={SEARCH_SUGGESTION_ITEM}
            portalProps={{
              className: classes.item,
              onClick: (e, q) => onClick(e, q && typeof q === 'string' ? q : suggestion),
              suggestion,
            }}
            key={suggestion}
          >
            <button
              type="button"
              className={classes.item}
              onClick={e => onClick(e, suggestion)}
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
};

SuggestionList.propTypes = {
  bottomHeight: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  visible: PropTypes.bool,
};

SuggestionList.defaultProps = {
  suggestions: [],
  visible: false,
  searchPhrase: '',
};

/**
 * @param {Object} prevProps Previous props.
 * @param {Object} nextProps Next props.
 * @returns {boolean} True if render can be skipped (props effectively unchanged for this UI).
 */
const areEqual = (prevProps, nextProps) => !(
  (nextProps.fetching === false && nextProps.suggestions) ||
  (prevProps.visible !== nextProps.visible) ||
  (prevProps.searchPhrase !== nextProps.searchPhrase)
);

const MemoizedSuggestionList = memo(SuggestionList, areEqual);

export { MemoizedSuggestionList as UnwrappedSuggestionList };

export default connect(MemoizedSuggestionList);
