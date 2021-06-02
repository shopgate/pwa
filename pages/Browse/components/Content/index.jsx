import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { BackBar } from 'Components/AppBar/presets';
import Headline from 'Components/Headline';
import SearchField from '../SearchField';
import RootCategories from '../RootCategories';

/**
 * The BrowseContent component.
 * @param {Object} params The component params.
 * @param {string} params.pageId The id of the page.
 * @param {string} params.query The last query.
 * @param {Object} context The context.
 * @returns {JSX}
 */
const BrowseContent = ({ pageId, query }, context) => {
  const { __ } = context.i18n();
  return (
    <Fragment>
      <BackBar />
      <Headline text={__('titles.browse')} tag="h1" />
      <SearchField pageId={pageId} query={query} />
      <RootCategories />
    </Fragment>
  );
};

BrowseContent.propTypes = {
  pageId: PropTypes.string.isRequired,
  query: PropTypes.string,
};

BrowseContent.defaultProps = {
  query: '',
};

BrowseContent.contextTypes = {
  i18n: PropTypes.func,
};

export default BrowseContent;
