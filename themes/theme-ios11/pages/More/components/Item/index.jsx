import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Link';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * @returns {JSX}
 */
function MoreMenuItem({
  href, label, onClick, testId,
}) {
  if (!href && onClick) {
    return (
      <button className={styles} onClick={onClick} data-test-id={testId}>
        <I18n.Text string={label} />
      </button>
    );
  }

  return (
    <Link className={styles} href={href}>
      <I18n.Text string={label} />
    </Link>
  );
}

MoreMenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func,
  testId: PropTypes.string,
};

MoreMenuItem.defaultProps = {
  href: null,
  onClick: null,
  testId: null,
};

export default MoreMenuItem;
