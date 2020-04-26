import React, { useMemo } from 'react';
import classNames from 'classnames';
import Link from '@shopgate/pwa-common/components/Link';
import { i18n } from '@shopgate/engage/core';
import {
  getIndentation, getItemActive, item, link,
} from './SideNavigationItem.style';
import { useSideNavigation } from './SideNavigation.hooks';

type Props = {
  children?: any,
  level?: number,
  buttonRight?: any,
  forceActive?: boolean,
  className?: string,
  href: string,
  label: string
}

/**
 * SideNavigationItem component
 * @returns {JSX}
 */
const SideNavigationItem = ({
  level, href, label, buttonRight, children, forceActive, className,
}: Props) => {
  const { currentPathname } = useSideNavigation();
  const isActive = useMemo(() => currentPathname === href || forceActive, [
    currentPathname,
    forceActive,
    href,
  ]);

  return (
    <li className={className}>
      <div className={classNames(item.toString(), {
        [getItemActive()]: isActive,
      })}
      >
        { href ? (
          <Link
            tag="a"
            href={href}
            className={classNames(link, getIndentation(level))}
          >
            {i18n.text(label)}
          </Link>
        ) : (
          <button
            type="button"
            className={classNames(link, getIndentation(level))}
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

SideNavigationItem.defaultProps = {
  buttonRight: null,
  children: null,
  forceActive: false,
  level: 0,
  className: null,
};

export default SideNavigationItem;
