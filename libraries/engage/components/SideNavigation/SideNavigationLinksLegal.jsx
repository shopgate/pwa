import React from 'react';
import PropTypes from 'prop-types';
import SideNavigationItem from './SideNavigationItem';
import connect from './SideNavigationLinksLegal.connector';

/**
 * SideNavigationLinksLegal component.
 * @param {Object} props - The component props.
 * @param {Array<{label: string, url: string}>} [props.links] - The list of legal links.
 * @returns {*[]} The rendered component or null.
 */
const SideNavigationLinksLegal = ({ links }) => {
  if (!links) {
    return null;
  }

  return (
    links.map(({ label, url }) => (<SideNavigationItem key={url} href={url} label={label} />))
  );
};

SideNavigationLinksLegal.propTypes = {
  isFetching: PropTypes.bool,
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })),
};

SideNavigationLinksLegal.defaultProps = {
  links: null,
  isFetching: false,
};

export default connect(SideNavigationLinksLegal);
