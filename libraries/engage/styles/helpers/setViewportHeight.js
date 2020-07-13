import { setCSSCustomProp } from './cssCustomProperties';

/**
 * Sets the current (real) viewport height to the --vh custom property.
 */
export const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;

  setCSSCustomProp('--vh', `${vh}px`);
  setCSSCustomProp('--vh-80', 'calc(var(--vh) * 80)');
  setCSSCustomProp('--vh-90', 'calc(var(--vh) * 90)');
  setCSSCustomProp('--vh-100', 'calc(var(--vh) * 100)');
};
