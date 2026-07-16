import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useIframeMessenger } from '@shopgate/engage/admin-preview/hooks';
import { ALLOWED_ADMIN_PREVIEW_ORIGINS } from '@shopgate/engage/admin-preview/constants';
import { receiveAppSettings } from '@shopgate/engage/settings/action-creators/appSettings';
import { logger } from '@shopgate/engage/core/helpers';
// Imported via its module path, since the "styles" barrel pulls in the ThemeProvider which renders
// this component, and would therefore create a circular import.
import useColorScheme from '@shopgate/engage/styles/theme/hooks/useColorScheme';
import type {
  FrontendSettingsPreviewBridgeMessage,
  FrontendSettingsStyling,
} from './types';
import {
  getOrCreateStyleTag,
  removeStyleTag,
  serializeStyling,
} from './helpers';

/**
 * Headless bridge that connects the app to the admin frontend settings preview. It listens for
 * messages from the parent window and applies the received styling, app settings and color scheme
 * while in preview mode.
 */
const FrontendSettingsPreviewBridge = () => {
  const [styling, setStyling] = useState<FrontendSettingsStyling | null>(null);
  const dispatch = useDispatch();
  const { setMode, modes } = useColorScheme();

  const { sendToParent } = useIframeMessenger<FrontendSettingsPreviewBridgeMessage>((data) => {
    if (data.type === 'receiveFrontendSettings') {
      setStyling(data.payload?.styling ?? null);

      if (data.payload?.appSettings) {
        dispatch(receiveAppSettings(data.payload.appSettings));
      }
    }

    if (data.type === 'setColorScheme') {
      const colorScheme = data.payload?.colorScheme;

      // setMode rejects unsupported schemes as well, but this message arrives from another origin,
      // so it is worth naming the admin as the source of the bad value.
      if (!modes.includes(colorScheme)) {
        logger.warn(`FrontendSettingsPreviewBridge: received unsupported color scheme "${colorScheme}"`);
        return;
      }

      setMode(colorScheme);
    }
  }, ALLOWED_ADMIN_PREVIEW_ORIGINS);

  useEffect(() => {
    sendToParent({ type: 'frontendSettingsPreviewReady' });
  }, [sendToParent]);

  useEffect(() => {
    if (!styling) {
      removeStyleTag();
      return;
    }

    getOrCreateStyleTag().textContent = serializeStyling(styling);
  }, [styling]);

  useEffect(() => () => {
    removeStyleTag();
  }, []);

  return null;
};

export default FrontendSettingsPreviewBridge;
