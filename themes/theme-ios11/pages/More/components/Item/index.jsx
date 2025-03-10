import React from 'react';
import PropTypes from 'prop-types';
import { Link, I18n } from '@shopgate/engage/components';
import styles from './style';

/**
 * @returns {JSX.Element}
 */
function MoreMenuItem({
  href, label, onClick, testId, className,
}) {
  if (!href && onClick) {
    return (
      <button className={className || styles} onClick={onClick} data-test-id={testId} type="button">
        <I18n.Text string={label} />
      </button>
    );
  }

  return (
    <Link className={className || styles} href={href} role="button">
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
