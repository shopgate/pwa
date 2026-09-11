import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { applyScrollContainer } from '@shopgate/engage/core/helpers';
import { ScrollHeader, SurroundPortals } from '@shopgate/engage/components';
import { GlobalLocationSwitcher, FulfillmentSlotSwitcher } from '@shopgate/engage/locations/components';
import { themeConfig } from '@shopgate/engage';
import { makeStyles } from '@shopgate/engage/styles';
import FilterBar from '@shopgate/engage/product/components/FilterBar';

const { variables: { scroll: { offset = 100 } = {} } } = themeConfig || {};

const useStyles = makeStyles()(() => ({
  filters: {
    ...(applyScrollContainer() ? { top: 0 } : { top: 44 }),
    display: 'block',
    zIndex: 1000,
  },
}));

/**
 * The ProductFilters component renders the FilterBar component wrapped in a ScrollHeader.
 *
 * Depending on the "@shopgate/engage/components/FilterBar" widget settings, the FilterBar will
 * either be fixed at the top of the page or hide when the user scrolls down.
 * @param {Object} props The component props
 * @param {Object} [props.categoryId] The category id when shown for a category page.
 * @param {Object} [props.searchPhrase] The search phrase when shown for a search page.
 * @param {Object} [props.showFilters=false] Whether to show the filter bar.
 * @param {Object} [props.hasSubcategories=false] Whether a category has subcategories.
 * @returns {JSX.Element}
 */
const ProductFilters = ({
  categoryId, showFilters, hasSubcategories, searchPhrase,
}) => {
  const { classes } = useStyles();
  const { hideOnScroll } = useWidgetSettings('@shopgate/engage/components/FilterBar');

  return (
    <ScrollHeader
      className={classes.filters}
      hideOnScroll={hideOnScroll}
      scrollOffset={offset}
    >
      <SurroundPortals
        portalName="filter-bar.content"
        portalProps={{
          categoryId,
          hasSubcategories,
          searchPhrase,
          showFilters,
        }}
      >
        <GlobalLocationSwitcher renderBar />
        <FulfillmentSlotSwitcher renderBar />

        {showFilters && (
        <FilterBar categoryId={categoryId} />
        )}
      </SurroundPortals>
    </ScrollHeader>
  );
};

ProductFilters.propTypes = {
  categoryId: PropTypes.string,
  hasSubcategories: PropTypes.bool,
  searchPhrase: PropTypes.string,
  showFilters: PropTypes.bool,
};

ProductFilters.defaultProps = {
  showFilters: false,
  categoryId: null,
  hasSubcategories: false,
  searchPhrase: null,
};

export default ProductFilters;
