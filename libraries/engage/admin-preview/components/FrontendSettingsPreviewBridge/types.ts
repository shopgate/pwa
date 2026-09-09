import type { AppSettingsPayload } from '@shopgate/engage/settings/types/appSettings';
import type { ColorSchemeName } from '@shopgate/engage/styles/theme/createTheme';

export type CSSDeclarationValue = string | number;
export type FrontendSettingsStyling = Record<string, Record<string, CSSDeclarationValue>>;

export type FrontendSettingsPreviewBridgeMessage =
  | {
    type: 'receiveFrontendSettings';
    payload?: {
      styling?: FrontendSettingsStyling;
      appSettings?: AppSettingsPayload;
    };
  }
  | {
    type: 'setColorScheme';
    payload: {
      colorScheme: ColorSchemeName;
    };
  }
  | {
    type: 'frontendSettingsPreviewReady';
    payload?: never;
  }
  | {
    /**
     * Outbound. Announces that the first settings payload has been applied and the app rendered
     * with it, so the admin can drop the loading overlay it shows while the preview boots.
     */
    type: 'frontendSettingsPreviewApplied';
    payload?: never;
  };
