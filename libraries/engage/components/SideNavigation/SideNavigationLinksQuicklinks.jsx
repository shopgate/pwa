import React from 'react';
import PropTypes from 'prop-types';
import SideNavigationItem from './SideNavigationItem';
import connect from './SideNavigationLinksQuicklinks.connector';

/**
 *
 * @param {Object} props The component props
 * @param {Array} props.links The quicklinks links
 * @returns {*[]}
 */
const SideNavigationLinksQuicklinks = ({ links }) => {
  if (!links) {
    return null;
  }

  return (
    links.map(({ label, url }) => (<SideNavigationItem key={url} href={url} label={label} />))
  );
};

SideNavigationLinksQuicklinks.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape()),
};

SideNavigationLinksQuicklinks.defaultProps = {
  links: null,
};

export default connect(SideNavigationLinksQuicklinks);
