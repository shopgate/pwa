import debounce from 'lodash/debounce';
import breakpoints from './breakpoints';

let listeners = [];

/**
 * Adds a new listener to breakpoint changes.
 * @param {Function} cb The callback that shall be triggered.
 * @returns {Function}
 */
export const addListener = (cb) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter(a => a !== cb);
  };
};

/**
 * Calculates the active breakpoint.
 * @returns {Object}
 */
const getActiveBreakpoint = () => breakpoints
  .find(
    bp => bp.from <= document.documentElement.clientWidth &&
          bp.to >= document.documentElement.clientWidth
  );

let activeBreakpoint = getActiveBreakpoint();

/**
 * Handles any event that might cause a breakpoint change.
 */
const handleEvent = () => {
  const newBreakpoint = getActiveBreakpoint();
  if (activeBreakpoint.name !== newBreakpoint.name) {
    activeBreakpoint = newBreakpoint;
    listeners.forEach(listener => listener(newBreakpoint));
  }
};

window.addEventListener('resize', debounce(handleEvent, 200));
window.addEventListener('orientationchange', handleEvent);
