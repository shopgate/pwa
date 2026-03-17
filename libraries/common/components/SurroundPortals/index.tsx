import React from 'react';
import Portal from '../Portal';
import { AFTER, BEFORE } from '../../constants/Portals';

export interface SurroundPortalsProps {
  /**
   * The name of the main portal.
   * The additional portals will be named `${portalName}.before` and `${portalName}.after`.
   */
  portalName: string;
  /**
   * Optional props to be passed to all three portals.
   */
  portalProps?: Record<string, unknown>;
  children?: React.ReactNode;
}

/**
 * The SurroundPortals component renders three Portal components. The main portal is wrapped around
 * its children, the two additional portals are rendered before and after the main portal.
 * The names of the additional portals are automatically created from the name of the main portal
 * with a ".before" and ".after" suffix.
 *
 * @returns The SurroundPortals component.
 */
const SurroundPortals = ({
  portalName,
  portalProps,
  children,
}: SurroundPortalsProps) => (
  <>
    <Portal name={`${portalName}.${BEFORE}`} props={portalProps} />
    <Portal name={portalName} props={portalProps}>
      {children}
    </Portal>
    <Portal name={`${portalName}.${AFTER}`} props={portalProps} />
  </>
);

export default SurroundPortals;
