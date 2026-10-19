import { useCallback } from 'react';
import type { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { AppBarIOS as AppBar, Badge, SurroundPortals } from '@shopgate/engage/components';
import { APP_BAR_ACTION, APP_BAR_CART_BUTTON } from '@shopgate/engage/core/constants';
import { i18n } from '@shopgate/engage/core/helpers';
import { NavigationAction } from '@shopgate/engage/navigation';
import type { ResolvedNavigationAction } from '@shopgate/engage/navigation';
import { getShowWishlistItemsCountBadge } from '@shopgate/engage/settings/selectors/shopSettings';
import type {
  AppBarButtonSlot,
  NavigationActionSettings,
} from '@shopgate/engage/settings/types/appSettings';
import { makeStyles } from '@shopgate/engage/styles';
import { useShowFavoritesCounter } from '../../../TabBar/components/FavoritesAction/hooks';
import { getActionIcon } from './icons';

const AppBarIcon = AppBar.Icon as unknown as ComponentType<Record<string, unknown>>;

const BADGE_MAX = 99;

/**
 * Takes the place of an icon nobody defined.
 * @returns Nothing.
 */
const NoIcon = () => null;

const useStyles = makeStyles()(theme => ({
  badge: {
    position: 'absolute',
    top: theme.spacing(0.25),
    right: 0,
    transform: 'scale(0.875)',
    transformOrigin: 'top right',
  },
}));

interface ResolvedButtonProps {
  action: ResolvedNavigationAction;
  settings: NavigationActionSettings;
  slot: AppBarButtonSlot;
}

/**
 * The button of a resolved action.
 * @param props The component props.
 * @param props.action The resolved action.
 * @param props.settings The configured action.
 * @param props.slot The slot of the button.
 * @returns The button with the counter of the cart and the favorites, as in the tab bar.
 */
const ResolvedButton = ({ action, settings, slot }: ResolvedButtonProps) => {
  const { classes, cx } = useStyles();
  const { badgeCount = 0, label, onClick } = action;
  const isFavorites = settings.action === 'favorites';
  const showFavoritesCounter = useShowFavoritesCounter();
  const showFavoritesBadge = useSelector(getShowWishlistItemsCountBadge) as boolean;
  const showBadge = badgeCount > 0 && (!isFavorites || showFavoritesBadge);
  const showCount = !isFavorites || showFavoritesCounter;
  const configuredIcon = getActionIcon(settings.icon);
  const iconName = configuredIcon ? settings.icon : action.icon;
  const IconComponent = configuredIcon ?? getActionIcon(action.icon) ?? NoIcon;

  const renderBadge = useCallback(() => (
    <Badge
      count={badgeCount}
      max={BADGE_MAX}
      showCount={showCount}
      className={cx(classes.badge, 'theme__app-bar__action-badge')}
    />
  ), [badgeCount, classes.badge, cx, showCount]);

  const text = i18n.text(label);

  return (
    <AppBarIcon
      icon={IconComponent}
      onClick={onClick}
      badge={showBadge ? renderBadge : null}
      aria-label={showBadge && showCount ? `${text}. ${i18n.text('common.products')}: ${badgeCount}.` : text}
      testId={`AppBarAction-${iconName}`}
      className="theme__app-bar__action"
      data-action={settings.action}
      data-slot={slot}
    />
  );
};

interface Props {
  settings: NavigationActionSettings;
  slot: AppBarButtonSlot;
  /** Whether the header floats over the content. */
  overlay?: boolean;
}

/**
 * A header button that runs a configured action. The cart button keeps the portals of the former
 * cart button of the product page.
 * @param props The component props.
 * @param props.settings The configured action.
 * @param props.slot The slot of the button.
 * @param props.overlay Whether the header floats over the content.
 * @returns The button, or nothing while the action is not available.
 */
const ActionButton = ({ settings, slot, overlay = false }: Props) => (
  <NavigationAction settings={settings}>
    {(action) => {
      const button = (
        <SurroundPortals
          portalName={`${APP_BAR_ACTION}.${slot}`}
          portalProps={{
            slot,
            settings,
            action,
            overlay,
          }}
        >
          <ResolvedButton action={action} settings={settings} slot={slot} />
        </SurroundPortals>
      );

      return settings.action === 'cart'
        ? <SurroundPortals portalName={APP_BAR_CART_BUTTON}>{button}</SurroundPortals>
        : button;
    }}
  </NavigationAction>
);

export default ActionButton;
