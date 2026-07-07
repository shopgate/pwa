import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useIframeMessenger } from '@shopgate/engage/admin-preview/hooks';
import { ALLOWED_ADMIN_PREVIEW_ORIGINS } from '@shopgate/engage/admin-preview/constants';
import { receiveAppSettings } from '@shopgate/engage/core/action-creators';
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
 * messages from the parent window and applies the received styling while in preview mode.
 */
const FrontendSettingsPreviewBridge = () => {
  const [styling, setStyling] = useState<FrontendSettingsStyling | null>(null);
  const dispatch = useDispatch();

  const { sendToParent } = useIframeMessenger<FrontendSettingsPreviewBridgeMessage>((data) => {
    if (data.type === 'receiveFrontendSettings') {
      if (data.payload?.styling) {
        setStyling(data.payload.styling);
      }

      if (data.payload?.appSettings) {
        dispatch(receiveAppSettings(data.payload.appSettings));
      }
    }
  }, ALLOWED_ADMIN_PREVIEW_ORIGINS);

  useEffect(() => {
    sendToParent({ type: 'frontendSettingsPreviewReady' });
  }, [sendToParent]);

  useEffect(() => {
    const styleTag = getOrCreateStyleTag();

    if (!styling) {
      styleTag.textContent = '';
      return;
    }

    styleTag.textContent = serializeStyling(styling);
  }, [styling]);

  useEffect(() => () => {
    removeStyleTag();
  }, []);

  return null;
};

export default FrontendSettingsPreviewBridge;
