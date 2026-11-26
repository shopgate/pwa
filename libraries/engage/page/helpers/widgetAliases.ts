import { isDev, logger } from '@shopgate/engage/core/helpers';

const widgetAliases = new Map<string, string>();

/**
 * Registers widget aliases. Call it in an `appWillStart$` subscriber.
 * @param aliases Old widget codes and their targets.
 */
export const registerWidgetAliases = (aliases: Record<string, string>) => {
  Object.entries(aliases).forEach(([code, target]) => {
    const existing = widgetAliases.get(code);

    if (isDev && existing && existing !== target) {
      logger.warn(`registerWidgetAliases: "${code}" now points to "${target}" instead of "${existing}"`);
    }

    widgetAliases.set(code, target);
  });
};

/**
 * Resolves a widget code. An installed widget wins over an alias.
 * @param code The widget code.
 * @param components The installed widgets.
 * @returns The code to render.
 */
export const resolveWidgetCode = (code: string, components: Record<string, unknown>) => {
  if (components[code]) {
    return code;
  }

  const target = widgetAliases.get(code);

  return target && components[target] ? target : code;
};
