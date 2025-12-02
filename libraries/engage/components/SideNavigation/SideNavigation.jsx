import React from 'react';
import PropTypes from 'prop-types';
import SideNavigationProvider from './SideNavigationProvider';
import SideNavigationContent from './SideNavigationContent';

/**
 * The SideNavigation component.
 * @param {Object} props The component props.
 * @param {Object} [props.classNames=null] Custom class names for the component.
 * @param {number} [props.maxCategoryNesting=3] Maximum category nesting level.
 * @param {Array} [props.routePatternBlacklist=[]] List of route patterns to blacklist.
 * @returns {JSX.Element} The rendered component.
 */
const SideNavigation = ({
  maxCategoryNesting,
  routePatternBlacklist,
  classNames,
}) => (
  <SideNavigationProvider
    maxCategoryNesting={maxCategoryNesting}
    routePatternBlacklist={routePatternBlacklist}
  >
    <SideNavigationContent classNames={classNames} />
  </SideNavigationProvider>
);

SideNavigation.propTypes = {
  classNames: PropTypes.shape(),
  maxCategoryNesting: PropTypes.number,
  routePatternBlacklist: PropTypes.arrayOf(PropTypes.string),
};

SideNavigation.defaultProps = {
  maxCategoryNesting: 3,
  routePatternBlacklist: [],
  classNames: null,
};

export default SideNavigation;
