import { embeddedVideos } from '@shopgate/pwa-common/collections';
import { Vimeo, YouTube } from '@shopgate/pwa-common/collections/video-providers';
import { appWillStart$ } from '@shopgate/pwa-common/streams/app';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function app(subscribe) {
  subscribe(appWillStart$, () => {
    embeddedVideos.addProvider(new Vimeo());
    embeddedVideos.addProvider(new YouTube());
  });
}
