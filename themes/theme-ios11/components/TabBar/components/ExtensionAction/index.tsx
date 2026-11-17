import type { ComponentType, ReactElement, ReactNode } from 'react';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import NavigationAction from '@shopgate/engage/navigation/components/NavigationAction';
import { getNavigationActionBadge } from '@shopgate/engage/navigation/helpers';
import { getExtensionActionMeta } from '@shopgate/engage/navigation/registry';
import type { NavigationActionSettings } from '@shopgate/engage/settings/types/appSettings';
import { resolveActionIcon } from '../../../../helpers/actionIcons';
import TabBarActionJs from '../TabBarAction';
import TabBarBadge from '../TabBarBadge';
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
   * Accessible name of the tab, e.g. the label with the badge count.
   */
  'aria-label'?: string;
  /**
   * Rendered after the label, e.g. a badge.
   */
  children?: ReactNode;
}

const TabBarAction = TabBarActionJs as unknown as ComponentType<TabBarActionProps>;

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
 * The tab of an action that an extension registered. Its icon is the merchant's, else the one of
 * `tabBar`, else the one of the resolved action, else an empty slot of icon size.
 * @param props The component props.
 * @param props.settings The configured item.
 * @returns The tab, or nothing while the action is not available.
 */
const ExtensionAction = ({ settings }: Props) => {
  const tabBarMeta = getExtensionActionMeta(settings.action, 'tabBar');

  if (!tabBarMeta) {
    return null;
  }

  return (
    <NavigationAction settings={settings}>
      {(action) => {
        const label = i18n.text(tabBarMeta.label);
        const {
          count, max, showCount, ariaLabel,
        } = getNavigationActionBadge(action, label);
        const icon = resolveActionIcon(settings.icon, tabBarMeta.icon, action.icon);

        return (
          <TabBarAction
            type={settings.action}
            label={tabBarMeta.label}
            icon={<TabBarIcon icon={icon} />}
            isHighlighted={!!action.isActive}
            onClick={action.onClick}
            aria-label={ariaLabel ?? label}
          >
            <TabBarBadge
              count={count}
              max={max}
              showCount={showCount}
              className="theme__tab-bar__extension-badge"
            />
          </TabBarAction>
        );
      }}
    </NavigationAction>
  );
};

export default ExtensionAction;
