import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { BackBar } from 'Components/AppBar/presets';
import Headline from 'Components/Headline';
import SearchField from '../SearchField';
import RootCategories from '../RootCategories';

/**
 * The BrowseContent component.
 * @param {Object} params The component params.
 * @param {string} params.pageId The id of the page.
 * @param {string} params.query The last query.
 * @returns {JSX.Element}
 */
const BrowseContent = ({ pageId, query }) => (
  <>
    <BackBar />
    <Headline text={i18n.text('titles.browse')} tag="h1" />
    <SearchField pageId={pageId} query={query} />
    <RootCategories />
  </>
);

BrowseContent.propTypes = {
  pageId: PropTypes.string.isRequired,
  query: PropTypes.string,
};

BrowseContent.defaultProps = {
  query: '',
};

export default BrowseContent;
