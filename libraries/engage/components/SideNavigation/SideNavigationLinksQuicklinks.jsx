import React from 'react';
import SideNavigationItem from './SideNavigationItem';
import connect from './SideNavigationLinksQuicklinks.connector';

type Props = {
  links?: Array,
  isFetching?: boolean,
}

/**
 *
 * @param {Object} props The component props
 * @returns {JSX}
 */
const SideNavigationLinksQuicklinks = ({ links }: Props) => {
  if (!links) {
    return null;
  }

  return (
    links.map(({ label, url }) => (<SideNavigationItem key={url} href={url} label={label} />))
  );
};

SideNavigationLinksQuicklinks.defaultProps = {
  links: null,
  isFetching: false,
};

export default connect(SideNavigationLinksQuicklinks);
