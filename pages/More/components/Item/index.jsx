import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Link';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * @returns {JSX}
 */
function MoreMenuItem({
  href, label, onClick, testId, className,
}) {
  if (!href && onClick) {
    return (
      <button className={className || styles} onClick={onClick} data-test-id={testId}>
        <I18n.Text string={label} />
      </button>
    );
  }

  return (
    <Link className={className || styles} href={href}>
      <I18n.Text string={label} />
    </Link>
  );
}

MoreMenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  testId: PropTypes.string,
};

MoreMenuItem.defaultProps = {
  className: null,
  href: null,
  onClick: null,
  testId: null,
};

export default MoreMenuItem;
