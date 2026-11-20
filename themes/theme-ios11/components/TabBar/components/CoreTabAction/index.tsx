import { memo, useCallback } from 'react';
import type { ComponentType } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import { UIEvents } from '@shopgate/engage/core/events';
import { useAppDispatch } from '@shopgate/engage/core/hooks/useAppDispatch';
import { OPEN_CATEGORY_DRAWER } from '@shopgate/engage/navigation/constants';
import { makeStyles } from '@shopgate/engage/styles';
import TabBarActionJs from '../TabBarAction';
import TabBarIcon from '../TabBarIcon';
import { navigate } from '../actions';
import type { CoreTabTypeName } from '../../coreTabData';
import { CORE_TABS } from './tabTypes';
import type { TabExtras } from './tabTypes';

const TabBarAction = TabBarActionJs as unknown as ComponentType<Record<string, unknown>>;

const TAB_BAR_ACTION_DEFAULTS: Record<string, unknown> = TabBarActionJs.defaultProps;

const useIconStyles = makeStyles()({
  icon: {
    width: 24,
    height: 24,
  },
});

/**
 * The props of a core tab. Further props, e.g. from an extension, reach the portals and the tab.
 */
interface Props {
  /**
   * The tab type, emitted as `data-type` and passed to the portals.
   */
  type?: string;
  /**
   * I18n key of the tab label. Defaults to the label of the tab type.
   */
  label?: string;
  /**
   * Whether the tab is highlighted.
   */
  isHighlighted?: boolean;
  /**
   * The current history path.
   */
  path?: string;
  /**
   * Icon component configured by the merchant, replaces the default icon.
   */
  configuredIcon?: ComponentType | null;
  /**
   * Renders only the before and after portals.
   */
  portalsOnly?: boolean;
  /**
   * Opens the category drawer instead of the path of the tab.
   */
  opensCategoryDrawer?: boolean;
  /**
   * Further props, e.g. from an extension. They reach the portals and the tab.
   */
  [prop: string]: unknown;
}

/**
 * Takes the place of the additions of a tab type without any.
 * @returns No additions.
 */
const useNoExtras = (): TabExtras => ({ portalProps: {} });

/**
 * Applies the default props of `TabBarAction` to the props an item left undefined.
 * @param props The props of the tab.
 * @returns The props with the defaults.
 */
const withTabBarActionDefaults = (props: Record<string, unknown>) => {
  const result = { ...props };

  Object.keys(TAB_BAR_ACTION_DEFAULTS).forEach((name) => {
    if (result[name] === undefined) {
      result[name] = TAB_BAR_ACTION_DEFAULTS[name];
    }
  });

  return result;
};

/**
 * Creates the tab of a core tab type with its legacy portals.
 * @param tabType The tab type.
 * @returns The tab component.
 */
export const createCoreTabAction = (tabType: CoreTabTypeName) => {
  const {
    displayName,
    path: tabPath,
    label: defaultLabel,
    icon: DefaultIcon,
    portals,
    useExtras = useNoExtras,
    beforeWithoutTabBarAction = false,
  } = CORE_TABS[tabType];

  /**
   * The tab of the core tab type.
   * @param props The component props.
   * @param props.configuredIcon Icon component configured by the merchant.
   * @param props.portalsOnly Renders only the before and after portals.
   * @param props.opensCategoryDrawer Opens the category drawer instead of the path of the tab.
   * @returns The tab with its portals.
   */
  const CoreTabAction = ({
    configuredIcon: ConfiguredIcon,
    portalsOnly = false,
    opensCategoryDrawer = false,
    ...ownProps
  }: Props) => {
    const { classes } = useIconStyles();
    const dispatch = useAppDispatch();
    const label = ownProps.label ?? defaultLabel;
    const extras = useExtras(label);

    const historyPush = useCallback(
      (params: Parameters<typeof navigate>[0]) => dispatch(navigate(params)),
      [dispatch]
    );

    const handleClick = useCallback(() => {
      if (opensCategoryDrawer) {
        UIEvents.emit(OPEN_CATEGORY_DRAWER);
        return;
      }

      historyPush({ pathname: tabPath });
    }, [historyPush, opensCategoryDrawer]);

    const props = withTabBarActionDefaults({
      ...ownProps,
      label,
    });
    const propsWithoutTabBarAction = {
      ...props,
      historyPush,
      ...extras.portalProps,
    };
    const portalProps = {
      ...propsWithoutTabBarAction,
      TabBarAction,
    };

    const before = (
      <Portal
        name={portals.before}
        props={beforeWithoutTabBarAction ? propsWithoutTabBarAction : portalProps}
      />
    );
    const after = <Portal name={portals.after} props={portalProps} />;

    if (portalsOnly) {
      return (
        <>
          {before}
          {after}
        </>
      );
    }

    const tabBarActionProps: Record<string, unknown> = Object.fromEntries(Object.entries({
      ...props,
      historyPush,
    }).filter(([name]) => (
      !Object.prototype.hasOwnProperty.call(extras.portalProps, name)
    )));

    if (extras.ariaLabel !== undefined) {
      tabBarActionProps['aria-label'] = extras.ariaLabel;
    }

    if (extras.badge !== undefined) {
      tabBarActionProps.children = extras.badge;
    }

    return (
      <>
        {before}
        <Portal name={portals.main} props={portalProps}>
          <TabBarAction
            {...tabBarActionProps}
            icon={(
              <Portal name={portals.icon}>
                {ConfiguredIcon
                  ? <TabBarIcon icon={ConfiguredIcon} />
                  : <DefaultIcon className={classes.icon} />}
              </Portal>
            )}
            onClick={handleClick}
          />
        </Portal>
        {after}
      </>
    );
  };

  CoreTabAction.displayName = displayName;

  return memo(CoreTabAction);
};
