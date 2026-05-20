import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTION_ITEM,
  SEARCH_SUGGESTION_ITEM_CONTENT,
} from '@shopgate/engage/search';
import { withStyles, cx } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './connector';

const { colors } = themeConfig;

/**
 * The SuggestionList component.
 */
class SuggestionList extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      list: PropTypes.string,
      item: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    fetching: PropTypes.bool,
    searchPhrase: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    fetching: false,
    searchPhrase: null,
    suggestions: [],
  };

  /**
   * @param { Object } nextProps Next props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (nextProps.fetching === false && nextProps.suggestions) ||
      (nextProps.searchPhrase !== this.props.searchPhrase);
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      onClick, suggestions, searchPhrase, classes,
    } = this.props;

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
  }
}

const StyledSuggestionList = withStyles(SuggestionList, () => ({
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
}));

export { StyledSuggestionList as UnwrappedSuggestionList };

export default connect(StyledSuggestionList);
