import { useEffect, useState } from 'react';
import { useIframeMessenger } from '@shopgate/engage/admin-preview/hooks';
import { ALLOWED_ADMIN_PREVIEW_ORIGINS } from '@shopgate/engage/admin-preview/constants';
import type {
  FrontendSettingsPreviewMessage,
  FrontendSettingsStyling,
} from './types';
import {
  getOrCreateStyleTag,
  removeStyleTag,
  serializeStyling,
} from './helpers';

/**
 * Component that listens for messages from the parent window when in frontend settings preview mode.
 */
const FrontendSettingsPreview = () => {
  const [styling, setStyling] = useState<FrontendSettingsStyling | null>(null);

  const { sendToParent } = useIframeMessenger<FrontendSettingsPreviewMessage>((data) => {
    if (data.type === 'receiveFrontendSettings') {
      if (data.payload?.styling) {
        setStyling(data.payload.styling);
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

export default FrontendSettingsPreview;
