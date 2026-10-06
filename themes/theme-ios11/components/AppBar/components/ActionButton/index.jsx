import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Icon, AppBarIOS as AppBar, Badge } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { NavigationAction } from '@shopgate/engage/navigation';
import { getThemeIcon } from '@shopgate/engage/core/icons';
import { getShowWishlistItemsCountBadge } from '@shopgate/engage/settings/selectors/shopSettings';
import { makeStyles } from '@shopgate/engage/styles';
import { useShowFavoritesCounter } from '../../../TabBar/components/FavoritesAction/hooks';

const BADGE_MAX = 99;

const useStyles = makeStyles()({
  badge: {
    position: 'absolute',
    top: 6,
    right: 4,
  },
});

/**
 * Renders a theme icon by its name.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ThemeIcon = ({ name }) => <Icon content={getThemeIcon(name) || ''} />;

ThemeIcon.propTypes = {
  name: PropTypes.string.isRequired,
};

/**
 * The counter of the cart and favorites buttons, the same as in the tab bar.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const ActionBadge = ({ count, type }) => {
  const { classes, cx } = useStyles();
  const showFavoritesCounter = useShowFavoritesCounter();
  const showFavoritesBadge = useSelector(getShowWishlistItemsCountBadge);

  if (type === 'favorites' && !showFavoritesBadge) {
    return null;
  }

  return (
    <Badge
      count={count}
      max={BADGE_MAX}
      showCount={type !== 'favorites' || showFavoritesCounter}
      className={cx(classes.badge, 'theme__app-bar__action-badge')}
    />
  );
};

ActionBadge.propTypes = {
  count: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ResolvedButton = ({ action, actionType, iconName }) => {
  const { badgeCount, label, onClick } = action;

  const renderBadge = useCallback(() => (
    <ActionBadge count={badgeCount} type={actionType} />
  ), [actionType, badgeCount]);

  return (
    <AppBar.Icon
      icon={ThemeIcon}
      name={iconName}
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
  actionType: PropTypes.string.isRequired,
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
        actionType={settings.action}
        iconName={settings.icon && getThemeIcon(settings.icon) ? settings.icon : action.icon}
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
