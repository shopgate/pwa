import { event, registerEvents } from '@shopgate/pwa-core';
import { willRegisterLinkEvents, didRegisterLinkEvents } from '../../action-creators/app';
import { openLink } from '../../action-creators/history';
import { parseQueryStringToObject } from '../../helpers/router';
import handlePushNotification from './handlePushNotification';
import handleDeepLink from './handleDeepLink';

/**
 * Registers all link events.
 * @param {Object} location The current history location object.
 * @return {Function} A redux thunk.
 */
export default function registerLinkEvents(location) {
  return (dispatch) => {
    dispatch(willRegisterLinkEvents());

    registerEvents([
      'openPushNotification',
      'openDeepLink',
    ]);

    event.addCallback('openLink', handler => (
      dispatch(openLink(handler.action, handler.options))
    ));

    event.addCallback('openPushNotification', payload => (
      dispatch(handlePushNotification(payload))
    ));

    event.addCallback('openDeepLink', payload => (
      dispatch(handleDeepLink(payload))
    ));

    dispatch(didRegisterLinkEvents());

    dispatch(openLink('reactRouter', {
      url: location.pathname,
      queryParams: parseQueryStringToObject(location.search),
    }));
  };
}
