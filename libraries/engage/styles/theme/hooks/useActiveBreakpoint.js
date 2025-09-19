import { useContext } from 'react';
import { ActiveBreakpointContext } from '../providers/ActiveBreakpointProvider';

// eslint-disable-next-line valid-jsdoc
/**
 * Returns the active breakpoint for the current window size.
 */
const useActiveBreakpoint = () => useContext(ActiveBreakpointContext);

export default useActiveBreakpoint;
