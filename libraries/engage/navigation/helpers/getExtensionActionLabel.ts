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
 * Resolves the text of an extension action: the placement `label`, the hook's `label`, the
 * `adminLabel` of the shop language or `en-us`, else the action name.
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
): string => {
  if (hasText(label)) {
    return i18n.text(label);
  }

  if (hasText(actionLabel)) {
    return i18n.text(actionLabel);
  }

  if (!isObjectRecord(adminLabel)) {
    return action;
  }

  const lang: unknown = i18n.getLang();

  return (hasText(lang) ? pickAdminLabel(adminLabel, lang.toLowerCase()) : undefined)
    ?? pickAdminLabel(adminLabel, FALLBACK_ADMIN_LOCALE)
    ?? action;
};
