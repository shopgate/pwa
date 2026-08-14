import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIframeMessenger } from '@shopgate/engage/admin-preview/hooks';
import { ALLOWED_ADMIN_PREVIEW_ORIGINS } from '@shopgate/engage/admin-preview/constants';
import { receiveAppSettings } from '@shopgate/engage/settings/action-creators/appSettings';
import { getTypographyFontCssUrls } from '@shopgate/engage/settings/selectors/appSettings';
import { logger } from '@shopgate/engage/core/helpers';
// Imported via their module paths, since the "styles" barrel pulls in the ThemeProvider which
// renders this component, and would therefore create a circular import.
import useColorScheme from '@shopgate/engage/styles/theme/hooks/useColorScheme';
import { loadFontCss } from '@shopgate/engage/styles/helpers/loadFontCss';
import {
  getInitialFrontendSettingsStyling,
  hasInitialFrontendSettings,
} from '../../initialization/_internal/initialFrontendSettings';
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
  const [styling, setStyling] = useState<FrontendSettingsStyling | null>(
    getInitialFrontendSettingsStyling
  );
  const [applied, setApplied] = useState(hasInitialFrontendSettings);
  const announcedRef = useRef(false);
  const fontCssSyncRef = useRef<Promise<void>>(Promise.resolve());
  const dispatch = useDispatch();
  const { setMode, modes } = useColorScheme();
  const fontCssUrls = useSelector(getTypographyFontCssUrls);

  const { sendToParent } = useIframeMessenger<FrontendSettingsPreviewBridgeMessage>((data) => {
    if (data.type === 'receiveFrontendSettings') {
      // Dispatched before the local state, because the font css urls are derived from it. A message
      // listener runs outside React's batching, so setting `applied` first would announce the
      // preview against the previous urls.
      if (data.payload?.appSettings) {
        dispatch(receiveAppSettings(data.payload.appSettings));
      }

      setStyling(data.payload?.styling ?? null);
      setApplied(true);
    }

    if (data.type === 'setColorScheme') {
      const colorScheme = data.payload?.colorScheme;

      // setMode rejects unsupported schemes as well, but this message arrives from another origin,
      // so it is worth naming the admin as the source of the bad value. The `colorScheme` guard also
      // narrows away the defensive `undefined`, so `modes.includes` and `setMode` typecheck strictly.
      if (!colorScheme || !modes.includes(colorScheme)) {
        logger.warn(`FrontendSettingsPreviewBridge: received unsupported color scheme "${colorScheme}"`);
        return;
      }

      setMode(colorScheme);
    }
  }, ALLOWED_ADMIN_PREVIEW_ORIGINS);

  useEffect(() => {
    sendToParent({ type: 'frontendSettingsPreviewReady' });
  }, [sendToParent]);

  // App start already loaded the configured files. This keeps them in sync while the merchant
  // edits, since loadFontCss adds, keeps and removes link tags to match the urls it is given.
  useEffect(() => {
    fontCssSyncRef.current = loadFontCss(fontCssUrls);
  }, [fontCssUrls]);

  useEffect(() => {
    if (!styling) {
      removeStyleTag();
      return;
    }

    getOrCreateStyleTag().textContent = serializeStyling(styling);
  }, [styling]);

  // Declared after the styling and font effects so both have run for the applied payload before the
  // admin is told it can drop its overlay - effects run in declaration order, and React defers them
  // until after the browser painted. The font sync is awaited on top: app start already waited for
  // the configured files, but when it timed out the first payload can introduce one here, and
  // announcing before it loaded would expose the fallback font repaint the overlay exists to hide.
  useEffect(() => {
    if (!applied || announcedRef.current) {
      return;
    }

    announcedRef.current = true;

    fontCssSyncRef.current.then(() => {
      sendToParent({ type: 'frontendSettingsPreviewApplied' });
    });
  }, [applied, sendToParent]);

  useEffect(() => () => {
    removeStyleTag();
  }, []);

  return null;
};

export default FrontendSettingsPreviewBridge;
