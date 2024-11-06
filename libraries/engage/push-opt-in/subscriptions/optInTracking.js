import {
  softOptInShown$,
  softOptInSelected$,
  hardOptInShown$,
  hardOptInSelected$,
} from '@shopgate/engage/core/streams';
import { track } from '@shopgate/engage/tracking/helpers';

const softPushOptInShown$ = softOptInShown$
  .filter(({ action }) => action?.meta?.permission === 'push');

const softPushOptInSelected$ = softOptInSelected$
  .filter(({ action }) => action?.meta?.permission === 'push');

const hardPushOptInShown$ = hardOptInShown$
  .filter(({ action }) => action?.meta?.permission === 'push');

const hardPushOptInSelected$ = hardOptInSelected$
  .filter(({ action }) => action?.meta?.permission === 'push');

/**
 * Push opt in tracking subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function pushOptInTracking(subscribe) {
  subscribe(softPushOptInShown$, ({ action, getState }) => {
    const { meta: { permission, ...meta } } = action;

    track('customEvent', {
      eventCategory: 'softPushOptIn',
      eventAction: 'shown',
      eventLabel: null,
      additionalEventParams: {
        eventName: 'softPushOptInShown',
        ...meta,
      },
    }, getState());
  });

  subscribe(softPushOptInSelected$, ({ action, getState }) => {
    const { selection, meta: { permission, ...meta } } = action;

    track('customEvent', {
      eventCategory: 'softPushOptIn',
      eventAction: 'decision',
      eventLabel: selection,
      additionalEventParams: {
        eventName: 'softPushOptInSelected',
        selection,
        ...meta,
      },
    }, getState());
  });

  subscribe(hardPushOptInShown$, ({ action, getState }) => {
    const { meta: { permission, ...meta } } = action;

    track('customEvent', {
      eventCategory: 'hardPushOptIn',
      eventAction: 'shown',
      eventLabel: null,
      additionalEventParams: {
        eventName: 'hardPushOptInShown',
        ...meta,
      },
    }, getState());
  });

  subscribe(hardPushOptInSelected$, ({ action, getState }) => {
    const { selection, meta: { permission, ...meta } } = action;

    track('customEvent', {
      eventCategory: 'hardPushOptIn',
      eventAction: 'decision',
      eventLabel: selection,
      additionalEventParams: {
        eventName: 'hardPushOptInSelected',
        selection,
        ...meta,
      },
    }, getState());
  });
}
