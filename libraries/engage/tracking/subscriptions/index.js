import analytics from './analytics';
import cookieConsent from './cookieConsent';

export default (subscribe) => {
  analytics(subscribe);
  cookieConsent(subscribe);
};
