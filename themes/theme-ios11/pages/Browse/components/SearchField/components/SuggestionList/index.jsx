import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTION_ITEM,
  SEARCH_SUGGESTION_ITEM_CONTENT,
} from '@shopgate/engage/search/constants';
import { withStyles, cx } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './connector';

const { colors } = themeConfig;

/**
 * The SuggestionList component.
 */
class SuggestionList extends Component {
  static propTypes = {
    bottomHeight: PropTypes.number.isRequired,
    classes: PropTypes.shape({
      list: PropTypes.string,
      item: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    fetching: PropTypes.bool,
    searchPhrase: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.string),
    visible: PropTypes.bool,
  };

  static defaultProps = {
    suggestions: [],
    fetching: false,
    visible: false,
    searchPhrase: '',
  };

  /**
   * @param { Object } nextProps Next props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (nextProps.fetching === false && nextProps.suggestions) ||
      (this.props.visible !== nextProps.visible) ||
      (this.props.searchPhrase !== nextProps.searchPhrase);
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      onClick, suggestions, bottomHeight, visible, searchPhrase, classes,
    } = this.props;

    if (!visible) {
      return null;
    }

    if (!suggestions) {
      return (
        <SurroundPortals
          portalName={SEARCH_SUGGESTIONS}
          portalProps={{
            onClick,
            suggestions,
            searchPhrase,
            visible,
            bottomHeight,
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
          visible,
          bottomHeight,
        }}
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
  }
}

const StyledSuggestionList = withStyles(SuggestionList, (theme, { bottomHeight = 0 }) => ({
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

export { StyledSuggestionList as UnwrappedSuggestionList };

export default connect(StyledSuggestionList);
