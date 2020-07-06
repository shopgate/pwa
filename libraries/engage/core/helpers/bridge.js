/* global SGJavascriptBridge */
import { hasSGJavaScriptBridge } from '@shopgate/pwa-core';

/**
 * Checks whether the web bridge is active.
 * @returns {boolean}
 */
export function hasWebBridge() {
  if (!hasSGJavaScriptBridge()) {
    return false;
  }

  return ['web', 'desktop', 'mobile'].includes(SGJavascriptBridge?.type);
}
