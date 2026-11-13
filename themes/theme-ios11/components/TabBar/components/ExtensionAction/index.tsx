import type { ComponentType, ReactElement, ReactNode } from 'react';
import { Badge } from '@shopgate/engage/components';
import NavigationAction from '@shopgate/engage/navigation/components/NavigationAction';
import { getNavigationActionMeta } from '@shopgate/engage/navigation/registry';
import type { NavigationActionSettings } from '@shopgate/engage/settings/types/appSettings';
import { makeStyles } from '@shopgate/engage/styles';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import { getActionIcon } from '../../../../helpers/actionIcons';
import TabBarActionJs from '../TabBarAction';
import TabBarIcon from '../TabBarIcon';

/**
 * The props of `TabBarAction` that an extension tab uses.
 */
interface TabBarActionProps {
  /**
   * Emitted as `data-type`.
   */
  type: string;
  /**
   * I18n key or plain text of the label.
   */
  label: string;
  /**
   * The icon element.
   */
  icon?: ReactElement;
  /**
   * Whether the tab is highlighted.
   */
  isHighlighted: boolean;
  /**
   * Runs the action.
   */
  onClick: () => void;
  /**
   * Rendered after the label, e.g. a badge.
   */
  children?: ReactNode;
}

const TabBarAction = TabBarActionJs as unknown as ComponentType<TabBarActionProps>;

const useStyles = makeStyles()(theme => ({
  badge: {
    position: 'absolute',
    borderRadius: theme.components.tabBar.badgeBorderRadius,
    top: theme.components.tabBar.badgeTop,
    transform: 'translateX(-50%)',
    left: theme.components.tabBar.badgeLeft,
  },
}));

/**
 * The props of an extension tab.
 */
interface Props {
  /**
   * The configured item.
   */
  settings: NavigationActionSettings;
}

/**
 * The tab of an action that an extension registered.
 * @param props The component props.
 * @param props.settings The configured item.
 * @returns The tab, or nothing while the action is not available.
 */
const ExtensionAction = ({ settings }: Props) => {
  const { classes, cx } = useStyles();
  const tabBarMeta = getNavigationActionMeta(settings.action)?.tabBar;

  if (!tabBarMeta) {
    return null;
  }

  const icon = getActionIcon(settings.icon) ?? getActionIcon(tabBarMeta.icon);

  return (
    <NavigationAction settings={settings}>
      {action => (
        <TabBarAction
          type={settings.action}
          label={tabBarMeta.label}
          icon={icon ? <TabBarIcon icon={icon} /> : undefined}
          isHighlighted={!!action.isActive}
          onClick={action.onClick}
        >
          <Badge
            count={action.badgeCount ?? 0}
            max={CART_MAX_ITEMS}
            className={cx(classes.badge, 'theme__tab-bar__extension-badge')}
          />
        </TabBarAction>
      )}
    </NavigationAction>
  );
};

export default ExtensionAction;
