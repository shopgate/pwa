import type { ReactElement } from 'react';
import '../actions';
import { getNavigationAction } from '../registry';
import type { NavigationActionHook, NavigationActionSettings, ResolvedNavigationAction } from '../types';

export interface NavigationActionProps {
  settings: NavigationActionSettings;
  /** Renders the resolved action. Only called when the action is available. */
  children: (action: ResolvedNavigationAction) => ReactElement | null;
}

interface ResolverProps extends NavigationActionProps {
  useAction: NavigationActionHook;
}

/**
 * Calls the hook of one action. Remounted through its key whenever the action changes.
 * @param props The component props.
 * @param props.useAction The hook of the action.
 * @param props.settings The configured action.
 * @param props.children Renders the resolved action.
 * @returns The rendered action.
 */
const Resolver = ({ useAction, settings, children }: ResolverProps) => {
  const action = useAction(settings);
  return action.available ? children(action) : null;
};

/**
 * Resolves a configured action and renders it when it is available on the current page.
 * @param props The component props.
 * @param props.settings The configured action.
 * @param props.children Renders the resolved action.
 * @returns The rendered action.
 */
const NavigationAction = ({ settings, children }: NavigationActionProps) => {
  const useAction = settings?.action ? getNavigationAction(settings.action) : undefined;

  if (!useAction) {
    return null;
  }

  return (
    <Resolver key={settings.action} useAction={useAction} settings={settings}>
      {children}
    </Resolver>
  );
};

export default NavigationAction;
