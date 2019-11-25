import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTION_ITEM,
  SEARCH_SUGGESTION_ITEM_CONTENT,
} from '@shopgate/engage/search';
import { withForwardedRef } from '@shopgate/engage/core';
import connect from './connector';
import styles from './style';

/**
 * The SuggestionList component.
 */
class SuggestionList extends Component {
  static propTypes = {
    bottomHeight: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    fetching: PropTypes.bool,
    forwardedRef: PropTypes.shape(),
    suggestions: PropTypes.arrayOf(PropTypes.string),
    visible: PropTypes.bool,
  }

  static defaultProps = {
    suggestions: [],
    fetching: false,
    forwardedRef: null,
    visible: false,
  }

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
    const {
      onClick, suggestions, bottomHeight, visible, forwardedRef,
    } = this.props;

    if (!suggestions) {
      return null;
    }

    return (
      <SurroundPortals
        portalName={SEARCH_SUGGESTIONS}
        portalProps={{
          onClick,
          suggestions,
        }}
      >
        <div
          className={classnames(
            styles.list,
            styles.bottom(bottomHeight),
            { [styles.hidden]: !visible }
          )}
          ref={forwardedRef}
        >
          {suggestions.map(suggestion => (
            <SurroundPortals
              portalName={SEARCH_SUGGESTION_ITEM}
              portalProps={{
                className: styles.item,
                onClick: (e, q) => onClick(e, q && typeof q === 'string' ? q : suggestion),
                suggestion,
              }}
              key={suggestion}
            >
              <button
                type="button"
                className={styles.item}
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
  }
}

export { SuggestionList as UnwrappedSuggestionList };

export default withForwardedRef(connect(SuggestionList));
