import React from 'react';
import PropTypes from 'prop-types';
import { Link, I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  root: {
    '&:first-of-type': {
      boxShadow: '0 0 0 0',
    },
    boxShadow: `0 -1px 0 0 ${colors.darkGray}`,
    padding: '12px 0',
    'button&': {
      outline: 0,
      textAlign: 'inherit',
      width: '100%',
    },
  },
});

/**
 * @returns {JSX.Element}
 */
function MoreMenuItem({
  href, label, onClick, testId, className,
}) {
  const { classes, cx } = useStyles();
  const rootClass = cx(classes.root, className);

  if (!href && onClick) {
    return (
      <button className={rootClass} onClick={onClick} data-test-id={testId} type="button">
        <I18n.Text string={label} />
      </button>
    );
  }

  return (
    <Link className={rootClass} href={href} role="button">
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
