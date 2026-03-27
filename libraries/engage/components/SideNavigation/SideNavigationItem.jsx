import React, { useMemo, memo } from 'react';
import classNames from 'classnames';
import Link from '@shopgate/pwa-common/components/Link';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import PropTypes from 'prop-types';
import { useSideNavigation } from './SideNavigation.hooks';

const useStyles = makeStyles()((theme, { level }) => ({
  indentation: {
    paddingLeft: level * theme.spacing(2),
  },
  list: {
    position: 'relative',
  },
  item: {
    alignItems: 'center',
    display: 'flex',
    textAlign: 'left',
    outline: 0,
    padding: theme.spacing(2),
    position: 'relative',
    width: '100%',
    lineHeight: '1.45em',
  },
  itemActive: {
    background: 'var(--color-side-navigation-active-background)',
  },
  link: {
    flexGrow: 1,
    textAlign: 'left',
    outline: 0,
    color: theme.palette.text.primary,
    ':hover': {
      color: 'var(--color-primary)',
    },
  },
  linkActive: {
    color: 'var(--color-primary) !important',
  },
}));

/**
 * SideNavigationItem component.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} [props.children] - The child components.
 * @param {number} [props.level=0] - The indentation level of the item.
 * @param {React.ReactNode} [props.buttonRight] - The button to display on the right side.
 * @param {boolean} [props.forceActive=false] - Whether to force the item to be active.
 * @param {boolean} [props.forceInactive=false] - Whether to force the item to be inactive.
 * @param {string} [props.className] - Additional class names for the item.
 * @param {Function} [props.onClick] - The click handler for the item.
 * @param {string} [props.href] - The URL the item links to.
 * @param {string} props.label - The label text for the item.
 * @returns {JSX.Element} The rendered component.
 */
const SideNavigationItem = ({
  children,
  level,
  buttonRight,
  forceActive,
  forceInactive,
  className,
  onClick,
  href,
  label,
}) => {
  const { classes } = useStyles({ level });
  const { currentPathname } = useSideNavigation();
  const isActive = useMemo(() => !forceInactive && (currentPathname === href || forceActive), [
    currentPathname,
    forceActive,
    forceInactive,
    href,
  ]);

  return (
    <li className={classNames(classes.list, className)}>
      <div className={classNames(classes.item, {
        [classes.itemActive]: isActive,
      })}
      >
        { href ? (
          <Link
            tag="a"
            href={href}
            className={classNames(classes.link, classes.indentation, {
              [classes.linkActive]: isActive,
            })}
          >
            {i18n.text(label)}
          </Link>
        ) : (
          <button
            type="button"
            className={classNames(classes.link, classes.indentation, {
              [classes.linkActive]: isActive,
            })}
            onClick={onClick}
          >
            {i18n.text(label)}
          </button>
        )}
        { buttonRight}
      </div>
      {children}
    </li>
  );
};

SideNavigationItem.propTypes = {
  label: PropTypes.string.isRequired,
  buttonRight: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  forceActive: PropTypes.bool,
  forceInactive: PropTypes.bool,
  href: PropTypes.string,
  level: PropTypes.number,
  onClick: PropTypes.func,
};

SideNavigationItem.defaultProps = {
  buttonRight: null,
  children: null,
  forceActive: false,
  forceInactive: false,
  level: 0,
  href: null,
  className: null,
  onClick: () => {},
};

export default memo(SideNavigationItem);
