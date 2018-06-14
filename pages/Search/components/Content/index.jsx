import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import NoResults from '@shopgate/pwa-ui-shared/NoResults';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import Products from '../Products';
import connect from './connector';

/**
 * The SearchContent component.
 */
class SearchContent extends Component {
  static propTypes = {
    hasResults: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    searchPhrase: PropTypes.string.isRequired,
  }

  /**
   * @param {Object} nextProps The next component props.
   * @return {JSX}
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.hasResults !== nextProps.hasResults
      || this.props.isLoading !== nextProps.isLoading
    );
  }

  /**
   * @return {JSX}
   */
  render() {
    const { hasResults, isLoading, searchPhrase } = this.props;
    return (
      <Fragment>
        <Products searchPhrase={searchPhrase} sortOrder={DEFAULT_SORT} />
        {(!hasResults && !isLoading) && (
          <NoResults
            headlineText="search.no_result.heading"
            bodyText="search.no_result.body"
            searchPhrase={searchPhrase}
          />
        )}
      </Fragment>
    );
  }
}

export default connect(SearchContent);
