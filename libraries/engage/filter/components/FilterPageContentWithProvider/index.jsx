import React from 'react';
import PropTypes from 'prop-types';
import { FilterPageProvider } from '../../providers';
import Content from '../FilterPageContent';

/**
 * The FilterPageContent component
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const FilterPageContent = ({
  activeFilters,
  categoryId,
  searchPhrase,
  parentRouteId,
  AppBarComponent,
}) => (
  <FilterPageProvider
    activeFilters={activeFilters}
    categoryId={categoryId}
    searchPhrase={searchPhrase}
    parentRouteId={parentRouteId}
  >
    <Content AppBarComponent={AppBarComponent} />
  </FilterPageProvider>
);

FilterPageContent.propTypes = {
  activeFilters: PropTypes.shape(),
  AppBarComponent: PropTypes.elementType,
  categoryId: PropTypes.string,
  parentRouteId: PropTypes.string,
  searchPhrase: PropTypes.string,
};

FilterPageContent.defaultProps = {
  activeFilters: null,
  categoryId: null,
  searchPhrase: null,
  parentRouteId: null,
  AppBarComponent: null,
};

export default FilterPageContent;
