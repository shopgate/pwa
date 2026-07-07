import type { AppSettings } from '@shopgate/engage/core/types/appSettings';

export type CSSDeclarationValue = string | number;
export type FrontendSettingsStyling = Record<string, Record<string, CSSDeclarationValue>>;

export type FrontendSettingsPreviewBridgeMessage =
  | {
    type: 'receiveFrontendSettings';
    payload?: {
      styling?: FrontendSettingsStyling;
      appSettings?: AppSettings;
    };
  }
  | {
    type: 'frontendSettingsPreviewReady';
    payload?: never;
  };
