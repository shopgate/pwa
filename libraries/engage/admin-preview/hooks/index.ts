import { useCallback, useEffect, useRef } from 'react';
import { logger } from '@shopgate/engage/core/helpers';
import { getReferrerOrigin, isAllowedOrigin } from '../helpers';

export interface MessageData {
  /**
   * Identifier for the kind of message.
   */
  type: string;
  /**
   * Optional data payload for this message.
   */
  payload?: unknown;
}

export type OnIframeMessage<TMessage extends MessageData = MessageData> = (
  data: TMessage,
  rawEvent: MessageEvent<TMessage>
) => void;

export interface IframeMessengerResult<TMessage extends MessageData = MessageData> {
  /**
   * Send data up to window.parent.
   * If targetOrigin is omitted, uses the most recently seen origin
   * (from an incoming message), otherwise the origin derived from document.referrer.
   * Nothing is sent when neither of them is covered by parentOrigins.
   */
  sendToParent: (data: TMessage, targetOrigin?: string) => void;
}

/**
 * Hook for postMessage communication when your component is inside an iframe.
 *
 * Listens on window for "message" events, and only calls onMessage(data, rawEvent) if the origin
 * of the event is covered by parentOrigins and the message came from window.parent.
 *
 * @param onMessage Callback invoked when a trusted message arrives.
 * Receives data and the raw event so consumers can inspect origin, source,
 * and other metadata when needed.
 * @param parentOrigins Array of allowed parent origin patterns, e.g.
 * ['https://a.example.com', 'https://*.example.com']. See ALLOWED_ADMIN_PREVIEW_ORIGINS for
 * details about the supported wildcard syntax.
 * @param enabled Whether the message listener is supposed to be attached.
 * @returns An object with a single method:
 * sendToParent(data, [targetOrigin]) to post data to the parent window.
 */
export function useIframeMessenger<TMessage extends MessageData = MessageData>(
  onMessage: OnIframeMessage<TMessage>,
  parentOrigins: string[],
  enabled = true
): IframeMessengerResult<TMessage> {
  // Keep a ref to the latest onMessage callback so the listener always has it.
  const onMessageRef = useRef<OnIframeMessage<TMessage>>(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // Keep track of the last allowed origin we heard from
  const lastOriginRef = useRef<string | null>(null);

  /**
   * Send a message up to the parent window.
   * @param data - The data object to post.
   * @param targetOrigin Optional override for the origin to post to. Must be covered by
   * parentOrigins. If omitted, uses the last seen origin, then the referrer origin.
   */
  const sendToParent = useCallback(
    (data: TMessage, targetOrigin?: string) => {
      // Determine which origin to use: explicit, then last seen, then the embedding document.
      // Patterns are no valid postMessage targets, so an unresolved origin aborts the send.
      const originToUse = [targetOrigin, lastOriginRef.current, getReferrerOrigin()]
        .find(origin => isAllowedOrigin(origin, parentOrigins));

      if (!originToUse) {
        logger.warn(
          'useIframeMessenger: no allowed targetOrigin available. ' +
            'Provide parentOrigins or pass an allowed targetOrigin.'
        );
        return;
      }

      window.parent.postMessage(data, originToUse);
    },
    [parentOrigins]
  );

  // Attach / detach the "message" listener.
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    /**
     * Handler for incoming postMessage events.
     * @param rawEvent The original MessageEvent object.
     */
    function handler(rawEvent: MessageEvent<TMessage>) {
      // Only proceed if the origin is covered by our whitelist.
      if (!isAllowedOrigin(rawEvent.origin, parentOrigins)) return;
      // Ensure the message actually came from window.parent.
      if (rawEvent.source !== window.parent) return;

      // Record this origin as most recently seen.
      lastOriginRef.current = rawEvent.origin;

      // Forward the event.data and the raw event to the callback.
      onMessageRef.current(rawEvent.data, rawEvent);
    }

    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, [enabled, parentOrigins]);

  return { sendToParent };
}
