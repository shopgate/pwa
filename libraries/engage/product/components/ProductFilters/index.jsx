import React from 'react';
import PropTypes from 'prop-types';
import { useResponsiveValue } from '@shopgate/engage/core/hooks';
import { applyScrollContainer } from '@shopgate/engage/core/helpers';
import { ResponsiveContainer, ScrollHeader, SurroundPortals } from '@shopgate/engage/components';
import { GlobalLocationSwitcher, FulfillmentSlotSwitcher } from '@shopgate/engage/locations/components';
import { themeConfig } from '@shopgate/engage';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import FilterBar from '@shopgate/engage/product/components/FilterBar';
import { useFilterBarSettings } from '@shopgate/engage/product/hooks';

const { variables: { scroll: { offset = 100 } = {} } } = themeConfig || {};

const useStyles = makeStyles()(() => ({
  filters: {
    ...(applyScrollContainer() ? { top: 0 } : { top: 44 }),
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      top: 64,
      marginBottom: 16,
    },
    [responsiveMediaQuery('<=xs', { webOnly: true })]: {
      top: 56,
    },
    display: 'block',
    zIndex: 1000,
  },
}));

/**
 * The ProductFilters component renders the FilterBar component wrapped in a ScrollHeader.
 *
 * Depending on the filter bar settings, the FilterBar will either be fixed at the top of the page
 * or hide when the user scrolls down.
 * @param {Object} props The component props
 * @param {Object} [props.categoryId] The category id when shown for a category page.
 * @param {Object} [props.searchPhrase] The search phrase when shown for a search page.
 * @param {Object} [props.showFilters=false] Whether to show the filter bar.
 * @param {Object} [props.hasSubcategories=false] Whether a category has subcategories.
 * @param {React.ReactNode} [props.contentBefore=null] Content shown above the filter bar.
 * @returns {JSX.Element}
 */
const ProductFilters = ({
  categoryId, showFilters, hasSubcategories, searchPhrase, contentBefore,
}) => {
  const { classes } = useStyles();
  const { hideOnScroll } = useFilterBarSettings();

  // When the PWA is in website mode, we apply a higher offset value than usual because the AppBar
  // is larger.
  const responsiveOffset = useResponsiveValue('>xs', {
    webOnly: true,
    valueMatch: 220,
    valueMiss: offset,
  });

  return (
    <ScrollHeader
      className={classes.filters}
      hideOnScroll={hideOnScroll}
      scrollOffset={responsiveOffset}
    >
      {contentBefore}
      <SurroundPortals
        portalName="filter-bar.content"
        portalProps={{
          categoryId,
          hasSubcategories,
          searchPhrase,
          showFilters,
        }}
      >
        <ResponsiveContainer appAlways breakpoint="<=xs">
          <GlobalLocationSwitcher renderBar />
          <FulfillmentSlotSwitcher renderBar />
        </ResponsiveContainer>

        {showFilters && (
        <FilterBar categoryId={categoryId} />
        )}
      </SurroundPortals>
    </ScrollHeader>
  );
};

ProductFilters.propTypes = {
  categoryId: PropTypes.string,
  contentBefore: PropTypes.node,
  hasSubcategories: PropTypes.bool,
  searchPhrase: PropTypes.string,
  showFilters: PropTypes.bool,
};

ProductFilters.defaultProps = {
  contentBefore: null,
  showFilters: false,
  categoryId: null,
  hasSubcategories: false,
  searchPhrase: null,
};

export default ProductFilters;
