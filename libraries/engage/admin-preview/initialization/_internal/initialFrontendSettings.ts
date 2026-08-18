/**
 * Internal to the admin-preview package - do not import this module from anywhere else.
 *
 * Hands the payload that `awaitInitialFrontendSettings` received over to the
 * FrontendSettingsPreviewBridge, which mounts long after app start finished. Module state rather
 * than a store slice, because the styling map never belongs in redux - it is applied to a style
 * tag, and the bridge only needs it to avoid removing what app start already applied.
 */

import type { FrontendSettingsStyling } from '../../components/FrontendSettingsPreviewBridge/types';

let received = false;

let styling: FrontendSettingsStyling | null = null;

/**
 * Records the payload that app start received.
 * @param initialStyling The styling map the payload carried, if any.
 */
export const setInitialFrontendSettings = (initialStyling: FrontendSettingsStyling | null) => {
  received = true;
  styling = initialStyling;
};

/**
 * Whether app start received a payload. A payload without a styling map still counts - it
 * carried app settings, which is enough to consider the preview applied.
 * @returns True when a payload arrived during app start.
 */
export const hasInitialFrontendSettings = (): boolean => received;

/**
 * The styling map that app start applied, so the bridge can seed its state with it instead of
 * starting at null - which would make its first effect remove the style tag again.
 * @returns The styling map, or null when none arrived.
 */
export const getInitialFrontendSettingsStyling = (): FrontendSettingsStyling | null => styling;

/**
 * Test only. Module state outlives a test file's individual cases, so specs need a way back to the
 * initial state.
 */
export const resetInitialFrontendSettings = () => {
  received = false;
  styling = null;
};
