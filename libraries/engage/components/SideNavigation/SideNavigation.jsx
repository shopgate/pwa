import { hot } from 'react-hot-loader/root';
import React from 'react';
import {
  INDEX_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import SideNavigationCategories from './SideNavigationCategories';
import SideNavigationLinks from './SideNavigationLinks';
import SideNavigationProvider from './SideNavigationProvider';
import SideNavigationItem from './SideNavigationItem';
import { container } from './SideNavigation.style';

type Props = {
  maxCategoryNesting?: number
}

/**
 * The SideNavigation component
 * @returns {JSX}
 */
const SideNavigation = ({ maxCategoryNesting }: Props) => (
  <SideNavigationProvider maxCategoryNesting={maxCategoryNesting}>
    <nav className={container}>
      <ul>
        <SideNavigationItem href={INDEX_PATH} label="navigation.home" />
        <SideNavigationCategories />
        <SideNavigationLinks />
      </ul>
    </nav>
  </SideNavigationProvider>
);

SideNavigation.defaultProps = {
  maxCategoryNesting: 3,
};

export default hot(SideNavigation);
