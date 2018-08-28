import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import NoResults from '@shopgate/pwa-ui-shared/NoResults';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
// import FilterBar from 'Components/FilterBar';
import Products from '../Products';
import connect from './connector';

/**
 * The SearchContent component.
 */
class SearchContent extends Component {
  static propTypes = {
    searchPhrase: PropTypes.string.isRequired,
    showFilterBar: PropTypes.bool.isRequired,
    showNoResults: PropTypes.bool.isRequired,
  }

  /**
   * @param {Object} nextProps The next component props.
   * @return {JSX}
   */
  shouldComponentUpdate(nextProps) {
    return (
      (this.props.showNoResults !== nextProps.showNoResults)
      || (this.props.showFilterBar !== nextProps.showFilterBar)
    );
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      searchPhrase,
      showFilterBar,
      showNoResults,
    } = this.props;

    return (
      <Fragment>
        {/* showFilterBar && <FilterBar searchPhrase={searchPhrase} /> */}
        <Products searchPhrase={searchPhrase} sortOrder={DEFAULT_SORT} />
        {showNoResults && (
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
