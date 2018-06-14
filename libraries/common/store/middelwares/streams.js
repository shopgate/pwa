import { Subject } from 'rxjs/Subject';
import { UIEvents } from '@shopgate/pwa-core';

export const mainSubject = new Subject();

/**
 * Connects the redux store with RxJS and Observable streams.
 * @param {Object} store The redux store.
 * @return {Function}
 */
const observableMiddleware = store => next => (action) => {
  const prevState = store.getState();
  const result = next(action);

  mainSubject.next({
    action,
    dispatch: store.dispatch,
    events: UIEvents,
    getState: store.getState,
    prevState,
  });

  return result;
};

export default observableMiddleware;
