import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTION_ITEM,
  SEARCH_SUGGESTION_ITEM_CONTENT,
} from '@shopgate/engage/search';
import connect from './connector';
import styles from './style';

/**
 * The SuggestionList component.
 */
class SuggestionList extends Component {
  static propTypes = {
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
    const { onClick, suggestions, searchPhrase } = this.props;

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
          <Fragment />
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
        <div className={styles.list}>
          {suggestions.map(suggestion => (
            <SurroundPortals
              portalName={SEARCH_SUGGESTION_ITEM}
              portalProps={{
                className: styles.item.toString(),
                onClick,
                suggestion,
              }}
              key={suggestion}
            >
              <button
                type="button"
                className={styles.item}
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

export { SuggestionList as UnwrappedSuggestionList };

export default connect(SuggestionList);
