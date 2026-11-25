import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { applyScrollContainer } from '@shopgate/engage/core/helpers';
import { SurroundPortals } from '@shopgate/engage/components';
import { GlobalLocationSwitcher, FulfillmentSlotSwitcher } from '@shopgate/engage/locations/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import FilterBar from '@shopgate/engage/product/components/FilterBar';
import { useFilterBarSettings } from '@shopgate/engage/product/hooks';
import { useViewScroll } from '@shopgate/engage/core/hooks';

const SEARCH_BAR_HEIGHT = 'var(--sg-search-bar-height, 0px)';
const SEARCH_BAR_OFFSET = 'var(--sg-search-bar-offset, 0px)';

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'sticky',
    top: applyScrollContainer() ? SEARCH_BAR_HEIGHT : 44,
    left: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  bar: {
    backgroundColor: theme.palette.background.surface,
    pointerEvents: 'auto',
    transition: theme.transitions.create('transform', { duration: 200 }),
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
    [responsiveMediaQuery('<=xs', { appAlways: true })]: {
      boxShadow: 'rgba(0, 0, 0, 0.118) 0px 1px 6px, rgba(0, 0, 0, 0.118) 0px 1px 4px',
    },
  },
  following: applyScrollContainer() ? {
    transform: `translateY(calc(${SEARCH_BAR_OFFSET} - ${SEARCH_BAR_HEIGHT}))`,
  } : {},
  hidden: {
    transform: applyScrollContainer()
      ? `translateY(calc(-100% - ${SEARCH_BAR_HEIGHT}))`
      : 'translateY(-250%)',
  },
}));

/**
 * The ProductFilters component renders the FilterBar component at the top of the page.
 *
 * Depending on the filter bar settings, the FilterBar either stays at the top of the page and
 * follows the search bar, or hides when the user scrolls down. The bar stays visible while it
 * contains the focus.
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
  const { classes, cx } = useStyles();
  const { hideOnScroll } = useFilterBarSettings();
  const { scrollingDown } = useViewScroll({ enabled: hideOnScroll });
  const [focusWithin, setFocusWithin] = useState(false);
  const hidden = scrollingDown && !focusWithin;

  return (
    <div className={classes.root}>
      <div
        className={cx(classes.bar, {
          [classes.hidden]: hidden,
          [classes.following]: !hideOnScroll,
        })}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocusWithin(false);
          }
        }}
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
          <GlobalLocationSwitcher renderBar />
          <FulfillmentSlotSwitcher renderBar />

          {showFilters && (
          <FilterBar categoryId={categoryId} />
          )}
        </SurroundPortals>
      </div>
    </div>
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
