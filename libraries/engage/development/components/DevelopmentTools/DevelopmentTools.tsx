import { memo } from 'react';
import type { ReactNode } from 'react';
import { isDev } from '@shopgate/engage/core/helpers';
import Shortcuts from './Shortcuts';
import SimulatedInsets from '../SimulatedInsets';

export interface DevelopmentToolsProps {
  /**
   * The child components.
   */
  children: ReactNode;
}

/**
 * Provides development tools for the app.
 */
const DevelopmentTools = ({ children }: DevelopmentToolsProps) => {
  if (!isDev) {
    // Wrapped rather than returned directly: children can be an array, which a component may not
    // return under the React 17 types.
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <>
      <Shortcuts />
      <SimulatedInsets>
        {children}
      </SimulatedInsets>
    </>
  );
};

export default memo(DevelopmentTools);
