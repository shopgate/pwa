import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import SideNavigationCategories from './SideNavigationCategories';
import SideNavigationLinks from './SideNavigationLinks';
import SideNavigationItem from './SideNavigationItem';
import { useSideNavigation } from './SideNavigation.hooks';
import { container } from './SideNavigationContent.style';

/**
 * SideNavigationContent component.
 * @param {Object} props - The component props.
 * @param {Object} [props.classNames] - The class names for the navigation visibility.
 * @returns {JSX.Element} The rendered component.
 */
const SideNavigationContent = ({ classNames }) => {
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

SideNavigationContent.propTypes = {
  classNames: PropTypes.shape({
    visible: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    hidden: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
};

SideNavigationContent.defaultProps = {
  classNames: null,
};

export default SideNavigationContent;
