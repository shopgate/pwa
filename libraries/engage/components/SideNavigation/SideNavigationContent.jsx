import React, { useMemo } from 'react';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import SideNavigationCategories from './SideNavigationCategories';
import SideNavigationLinks from './SideNavigationLinks';
import SideNavigationItem from './SideNavigationItem';
import { useSideNavigation } from './SideNavigation.hooks';
import { container } from './SideNavigationContent.style';

type Props = {
  classNames?: {
    visible?: string | Object,
    hidden?: string | Object,
  },
}

/**
 * @returns {JSX}
 */
const SideNavigationContent = ({ classNames }: Props) => {
  const { isVisible } = useSideNavigation();
  const wrapperClass = useMemo(() => {
    if (!classNames) {
      return '';
    }

    const { visible = '', hidden = '' } = classNames;
    return isVisible ? visible : hidden;
  }, [classNames, isVisible]);

  return (
    <div className={wrapperClass}>
      { isVisible && (
        <nav className={container}>
          <ul>
            <SideNavigationItem href={INDEX_PATH} label="navigation.home" />
            <SideNavigationCategories />
            <SideNavigationLinks />
          </ul>
        </nav>
      )}

    </div>
  );
};

SideNavigationContent.defaultProps = {
  classNames: null,
};

export default SideNavigationContent;
