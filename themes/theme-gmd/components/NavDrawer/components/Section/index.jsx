import React from 'react';
import PropTypes from 'prop-types';
import { NavDrawer } from '@shopgate/engage/components';
import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * The NavDrawerSectionWrapper component wraps around the NavDrawerSection component. Depending on
 * the theme settings, it prevents rendering of section titles - even if a title was passed.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const NavDrawerSectionWrapper = props => (
  <NavDrawer.Section {...props} title={appConfig.showGmdMenuSubHeaders ? props.title : ''} />
);

NavDrawerSectionWrapper.Item = NavDrawer.Section.Item;

NavDrawerSectionWrapper.propTypes = {
  children: PropTypes.node,
  dividerBottom: PropTypes.bool,
  dividerTop: PropTypes.bool,
  title: PropTypes.string,
};

NavDrawerSectionWrapper.defaultProps = {
  children: null,
  dividerBottom: false,
  dividerTop: true,
  title: '',
};

export default NavDrawerSectionWrapper;
