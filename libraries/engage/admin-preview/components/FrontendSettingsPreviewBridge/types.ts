import type { AppSettingsPayload } from '@shopgate/engage/settings/types/appSettings';
import type { IconCatalog } from '@shopgate/engage/icons/types';
import type { ColorSchemeName } from '@shopgate/engage/styles/theme/createTheme';
import type { ADMIN_PREVIEW_FEATURES } from '../../constants';

/**
 * A preview feature that an app version supports, e.g. `iconCatalog`.
 */
export type AdminPreviewFeature = typeof ADMIN_PREVIEW_FEATURES[number];

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
    /**
     * Outbound. Announces that the preview listens for messages, with the features it supports.
     */
    type: 'frontendSettingsPreviewReady';
    payload: {
      features: readonly AdminPreviewFeature[];
    };
  }
  | {
    /**
     * Outbound. Announces that the first settings payload has been applied and the app rendered
     * with it, so the admin can drop the loading overlay it shows while the preview boots.
     */
    type: 'frontendSettingsPreviewApplied';
    payload?: never;
  }
  | {
    /**
     * Inbound. Asks for the icons a merchant can replace, answered with `iconCatalog`.
     */
    type: 'requestIconCatalog';
    payload?: never;
  }
  | {
    /**
     * Outbound. The icons a merchant can replace, with their defaults.
     */
    type: 'iconCatalog';
    payload: IconCatalog;
  };
