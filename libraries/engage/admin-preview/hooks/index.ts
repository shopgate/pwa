import { useCallback, useEffect, useRef } from 'react';
import { logger } from '@shopgate/engage/core/helpers';

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
   * (from an incoming message). If none was seen yet, falls back to
   * the origin derived from document.referrer, then parentOrigins[0], then "*".
   */
  sendToParent: (data: TMessage, targetOrigin?: string) => void;
}

/**
 * Hook for postMessage communication when your component is inside an iframe.
 *
 * Listens on window for "message" events from any origin in parentOrigins,
 * and only calls onMessage(data, rawEvent) if both origin and source match.
 *
 * @param onMessage Callback invoked when a trusted message arrives.
 * Receives data and the raw event so consumers can inspect origin, source,
 * and other metadata when needed.
 * @param parentOrigins Array of allowed parent origin strings, e.g.
 * ['https://a.example.com', 'https://b.example.com'].
 * @returns An object with a single method:
 * sendToParent(data, [targetOrigin]) to post data to the parent window.
 */
export function useIframeMessenger<TMessage extends MessageData = MessageData>(
  onMessage: OnIframeMessage<TMessage>,
  parentOrigins: string[]
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
   * @param targetOrigin Optional override for the origin to post to.
   * If omitted, uses the last seen origin, then referrer origin,
   * then parentOrigins[0], then "*".
   */
  const sendToParent = useCallback(
    (data: TMessage, targetOrigin?: string) => {
      // Determine which origin to use: explicit, then last seen, then first, then "*".
      const originToUse =
        typeof targetOrigin === 'string'
          ? targetOrigin
          : lastOriginRef.current ??
            (document.referrer ? new URL(document.referrer).origin : undefined) ??
            parentOrigins[0] ??
            '*';

      if (!originToUse) {
        logger.warn(
          'useIframeMessenger: no targetOrigin available. ' +
            'Provide parentOrigins or pass targetOrigin.'
        );
        return;
      }

      window.parent.postMessage(data, originToUse);
    },
    [parentOrigins]
  );

  // Attach / detach the "message" listener.
  useEffect(() => {
    /**
     * Handler for incoming postMessage events.
     * @param rawEvent The original MessageEvent object.
     */
    function handler(rawEvent: MessageEvent<TMessage>) {
      // Only proceed if the origin is in our whitelist.
      if (!parentOrigins.includes(rawEvent.origin)) return;
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
  }, [parentOrigins, sendToParent]);

  return { sendToParent };
}
