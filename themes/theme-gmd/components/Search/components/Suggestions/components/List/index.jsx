import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTION_ITEM,
  SEARCG_SUGGESTION_ITEM_CONTENT,
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
    suggestions: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    fetching: false,
    suggestions: [],
  };
  /**
   * @param { Object } nextProps Next props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.fetching === false && nextProps.suggestions;
  }

  /**
   * @return {JSX}
   */
  render() {
    const { onClick, suggestions } = this.props;

    if (!suggestions) {
      return null;
    }

    return (
      <SurroundPortals
        portalName={SEARCH_SUGGESTIONS}
        portalProps={{ suggestions }}
      >
        <div className={styles.list}>
          {suggestions.map(suggestion => (
            <SurroundPortals
              portalName={SEARCH_SUGGESTION_ITEM}
              portalProps={{ suggestion }}
              key={suggestion}
            >
              <button
                className={styles.item}
                onClick={onClick}
                value={suggestion}
                data-test-id={`searchSuggestion ${suggestion}`}
              >
                <SurroundPortals
                  portalName={SEARCG_SUGGESTION_ITEM_CONTENT}
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
