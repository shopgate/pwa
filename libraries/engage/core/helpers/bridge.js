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
  return SGJavascriptBridge?.type === 'web' || SGJavascriptBridge?.type === 'desktop';
}
