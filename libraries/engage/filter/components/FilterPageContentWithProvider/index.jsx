import React from 'react';
import PropTypes from 'prop-types';
import { FilterPageProvider } from '../../providers';
// eslint-disable-next-line no-unused-vars, import/named
import { RouteFilters } from '../../providers/FilterPageProvider.context';
import Content from '../FilterPageContent';

/**
 * The FilterPageContent component
 * @param {Object} props The component props
 * @param {RouteFilters} [props.activeFilters] Object with the active filters for a filtered product
 * list
 * @param {string} [props.parentRouteId] Id of the route with the product list that's supposed to be
 * filtered
 * @param {string} [props.categoryId] A category to be used for filter selection from Redux
 * @param {string} [props.searchPhrase] A search phrase to be used for filter selection from Redux
 * @param {React.ComponentType} [props.AppBarComponent] The component to be rendered as the app bar
 * @returns {JSX.Element}
 */
const FilterPageContentWithProvider = ({
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

FilterPageContentWithProvider.propTypes = {
  activeFilters: PropTypes.shape(),
  AppBarComponent: PropTypes.elementType,
  categoryId: PropTypes.string,
  parentRouteId: PropTypes.string,
  searchPhrase: PropTypes.string,
};

FilterPageContentWithProvider.defaultProps = {
  activeFilters: null,
  categoryId: null,
  searchPhrase: null,
  parentRouteId: null,
  AppBarComponent: null,
};

export default FilterPageContentWithProvider;
