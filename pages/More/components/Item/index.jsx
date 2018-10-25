import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Link';
import styles from './style';

/**
 * @returns {JSX}
 */
function MoreMenuItem({ href, children, onClick }) {
  if (!href && onClick) {
    return <button className={styles} onClick={onClick}>{children}</button>;
  }

  return (
    <Link className={styles} href={href || onClick}>{children}</Link>
  );
}

MoreMenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func,
};

MoreMenuItem.defaultProps = {
  href: null,
  onClick: null,
};

export default MoreMenuItem;
