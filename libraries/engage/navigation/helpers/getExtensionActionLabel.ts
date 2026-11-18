import { i18n } from '@shopgate/engage/core/helpers/i18n';
import { isObjectRecord } from './isObjectRecord';

const FALLBACK_ADMIN_LOCALE = 'en-us';

/**
 * Checks whether a value is a string with visible text.
 * @param value The value to check.
 * @returns Whether the value is a string that is not empty or whitespace only.
 */
const hasText = (value: unknown): value is string => (
  typeof value === 'string' && value.trim() !== ''
);

/**
 * Picks the admin label of a locale, comparing the keys case-insensitively.
 * @param adminLabel The admin labels of the action.
 * @param locale The locale in lower case.
 * @returns The admin label, if one with text exists.
 */
const pickAdminLabel = (
  adminLabel: Record<string, unknown>,
  locale: string
): string | undefined => {
  const entry = Object.entries(adminLabel).find((candidate): candidate is [string, string] => (
    candidate[0].toLowerCase() === locale && hasText(candidate[1])
  ));

  return entry?.[1];
};

/**
 * Resolves the text when no label has text: the `adminLabel` of the shop language or `en-us`,
 * else the name of the action.
 * @param action The name the action is registered under.
 * @param adminLabel The labels by admin locale.
 * @returns The text to show.
 */
const getAdminLabelOrName = (action: string, adminLabel: unknown): string => {
  if (!isObjectRecord(adminLabel)) {
    return action;
  }

  const lang: unknown = i18n.getLang();

  return (hasText(lang) ? pickAdminLabel(adminLabel, lang.toLowerCase()) : undefined)
    ?? pickAdminLabel(adminLabel, FALLBACK_ADMIN_LOCALE)
    ?? action;
};

/**
 * Translates the first of the labels that has text, else falls back to the admin label or name.
 * @param action The name the action is registered under.
 * @param labels The labels in the order they are tried, i18n keys or plain text.
 * @param adminLabel The labels by admin locale.
 * @returns The text to show.
 */
const resolveLabel = (action: string, labels: unknown[], adminLabel: unknown): string => {
  const label = labels.find(hasText);

  return label ? i18n.text(label) : getAdminLabelOrName(action, adminLabel);
};

/**
 * Resolves the text of an extension action's tab and admin item: the placement `label`, the hook's
 * `label`, the `adminLabel` of the shop language or `en-us`, else the action name.
 * @param action The name the action is registered under.
 * @param placementMeta The details the action was registered with for the placement.
 * @param placementMeta.label The label of the placement, an i18n key or plain text.
 * @param placementMeta.adminLabel The labels by admin locale.
 * @param actionLabel The label of the resolved action. Only known while rendering.
 * @returns The text to show.
 */
export const getExtensionActionLabel = (
  action: string,
  { label, adminLabel }: { label?: unknown; adminLabel?: unknown },
  actionLabel?: unknown
): string => resolveLabel(action, [label, actionLabel], adminLabel);

/**
 * Resolves the text of an extension action's header button: the hook's `label`, the `tabBar`
 * `label`, the `adminLabel` of the shop language or `en-us`, else the action name.
 * @param action The name the action is registered under.
 * @param actionLabel The label of the resolved action.
 * @param tabBarMeta The tab details of the action, if it has any.
 * @param tabBarMeta.label The label of the tab, an i18n key or plain text.
 * @param tabBarMeta.adminLabel The labels by admin locale.
 * @returns The text to show.
 */
export const getExtensionButtonLabel = (
  action: string,
  actionLabel: unknown,
  { label, adminLabel }: { label?: unknown; adminLabel?: unknown } = {}
): string => resolveLabel(action, [actionLabel, label], adminLabel);
