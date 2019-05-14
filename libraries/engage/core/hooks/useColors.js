import { useConfig } from './useConfig';

/**
 * Retrieves the global theme colors.
 * @returns {Object}
 */
export function useColors() {
  const { colors = {} } = useConfig();

  return colors;
}
