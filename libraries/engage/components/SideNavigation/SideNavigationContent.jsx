import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import SideNavigationCategories from './SideNavigationCategories';
import SideNavigationLinks from './SideNavigationLinks';
import SideNavigationItem from './SideNavigationItem';
import { useSideNavigation } from './SideNavigation.hooks';

const useStyles = makeStyles()({
  container: {
    background: '#fff',
  },
});

/**
 * SideNavigationContent component.
 * @param {Object} props - The component props.
 * @param {Object} [props.classNames] - The class names for the navigation visibility.
 * @returns {JSX.Element} The rendered component.
 */
const SideNavigationContent = ({ classNames }) => {
  const { classes } = useStyles();
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
        <nav className={classes.container}>
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
