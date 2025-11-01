import React from 'react';
import SideNavigationProvider from './SideNavigationProvider';
import SideNavigationContent from './SideNavigationContent';

type Props = {
  classNames?: Object,
  maxCategoryNesting?: number,
  routePatternBlacklist?: Array
}

/**
 * The SideNavigation component
 * @returns {JSX}
 */
const SideNavigation = ({
  maxCategoryNesting,
  routePatternBlacklist,
  classNames,
}: Props) => (
  <SideNavigationProvider
    maxCategoryNesting={maxCategoryNesting}
    routePatternBlacklist={routePatternBlacklist}
  >
    <SideNavigationContent classNames={classNames} />
  </SideNavigationProvider>
);

SideNavigation.defaultProps = {
  maxCategoryNesting: 3,
  routePatternBlacklist: [],
  classNames: null,
};

export default SideNavigation;
