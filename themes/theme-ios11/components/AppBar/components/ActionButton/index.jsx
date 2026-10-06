import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/engage';
import Icon from '@shopgate/pwa-common/components/Icon';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { i18n, useWidgetSettings } from '@shopgate/engage/core';
import { NavigationAction, FALLBACK_ICON } from '@shopgate/engage/navigation';
import CartBadge from '../CartButton/components/CartBadge';

/**
 * @param {string} name Key of the theme icon.
 * @returns {string} The svg markup of the icon.
 */
const getIconContent = name => themeConfig.icons?.[name];

/**
 * Renders a theme icon by its key.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ThemeIcon = ({ name }) => (
  <Icon content={getIconContent(name) || getIconContent(FALLBACK_ICON) || ''} />
);

ThemeIcon.propTypes = {
  name: PropTypes.string.isRequired,
};

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ResolvedButton = ({ action, iconName }) => {
  const { buttonColor } = useWidgetSettings('@shopgate/engage/components/AppBar');
  const { badgeCount, label, onClick } = action;

  const renderBadge = useCallback(() => (
    <CartBadge count={badgeCount} />
  ), [badgeCount]);

  return (
    <AppBar.Icon
      icon={ThemeIcon}
      name={iconName}
      color={buttonColor || 'inherit'}
      onClick={onClick}
      badge={badgeCount ? renderBadge : null}
      aria-label={i18n.text(label)}
      testId={`AppBarAction-${iconName}`}
    />
  );
};

ResolvedButton.propTypes = {
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    badgeCount: PropTypes.number,
  }).isRequired,
  iconName: PropTypes.string.isRequired,
};

/**
 * A header button that runs a configured action.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const ActionButton = ({ settings }) => (
  <NavigationAction settings={settings}>
    {action => (
      <ResolvedButton
        action={action}
        iconName={settings.icon && getIconContent(settings.icon) ? settings.icon : action.icon}
      />
    )}
  </NavigationAction>
);

ActionButton.propTypes = {
  settings: PropTypes.shape({
    action: PropTypes.string,
    icon: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
};

export default ActionButton;
