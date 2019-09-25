// List of available tracking events
export const TRACK_PAGEVIEW = 'pageview';
export const TRACK_VARIANT_SELECTED = 'variantSelected';
export const TRACK_VIEW_CONTENT = 'viewContent';
export const TRACK_PURCHASE = 'purchase';
export const TRACK_ADD_TO_CART = 'addToCart';
export const TRACK_ADD_TO_WISHLIST = 'addToWishlist';
export const TRACK_INITIATED_CHECKOUT = 'initiatedCheckout';
export const TRACK_COMPLETED_REGISTRATION = 'completedRegistration';
export const TRACK_SEARCH = 'search';
export const TRACK_SCROLL_TOP = 'scrollTop';
export const TRACK_ADDED_PAYMENT_INFO = 'addedPaymentInfo';
export const TRACK_SELECTED_PAYMENT_INFO = 'selectedPaymentInfo';
export const TRACK_SMARTBANNER = 'smartbanner';
export const TRACK_FILTER_LIVE_SUGGEST = 'filterLiveSuggest';
export const TRACK_QR_SCANNER = 'qrScanner';
export const TRACK_AD_SCANNER = 'adScanner';
export const TRACK_CC_SCANNER = 'ccScanner';
export const TRACK_OPEN_DEEP_LINK = 'openDeepLink';
export const TRACK_OPEN_UNIVERSAL_LINK = 'openUniversalLink';
export const TRACK_OPEN_DEFERRED_DEEP_LINK = 'openDeferredDeepLink';
export const TRACK_OPEN_SMART_APP_DOWNLOAD_LINK = 'openSmartAppDownloadLink';
export const TRACK_OPEN_PUSH_NOTIFICATION = 'openPushNotification';
export const TRACK_APP_REVIEW_PROMPT = 'appReviewPrompt';
export const TRACK_SET_CAMPAIGN_WITH_URL = 'setCampaignWithUrl';
export const TRACK_LOGIN_SUCCESS = 'loginSuccess';
export const TRACK_LOGIN_FAILED = 'loginFailed';
export const TRACK_CUSTOM_EVENT = 'customEvent';
export const REMOVE_TRACKER = 'removeTracker';
export const ADD_TRACKER = 'addTracker';

export const scannerEvents = {
  // Scan type is activated
  SCAN_ACTIVATED: 'scan_activated',
  // The actual scan stated (for QR scanner same as activated)
  SCAN_STARTED: 'scan_started',
  // Scanning process cancelled
  SCAN_CANCELED: 'scan_canceled',
  // Scan ended with success
  SCAN_SUCCESS: 'scan_success',
  // Scan ended with no result
  SCAN_FAIL: 'scan_fail',
  // User interact with scanning result (click on link)
  SCAN_USER_LINK_INTERACTION: 'scan_user_link_interaction',
};

export const customEvents = [
  TRACK_SMARTBANNER,
  TRACK_FILTER_LIVE_SUGGEST,
  TRACK_QR_SCANNER,
  TRACK_AD_SCANNER,
  TRACK_CC_SCANNER,
  TRACK_SCROLL_TOP,
  TRACK_OPEN_DEEP_LINK,
  TRACK_OPEN_UNIVERSAL_LINK,
  TRACK_OPEN_DEFERRED_DEEP_LINK,
  TRACK_OPEN_SMART_APP_DOWNLOAD_LINK,
  TRACK_OPEN_PUSH_NOTIFICATION,
  TRACK_APP_REVIEW_PROMPT,
  TRACK_CUSTOM_EVENT,
];

export default [
  TRACK_PAGEVIEW,
  TRACK_VIEW_CONTENT,
  TRACK_VARIANT_SELECTED,
  TRACK_PURCHASE,
  TRACK_ADD_TO_CART,
  TRACK_ADD_TO_WISHLIST,
  TRACK_INITIATED_CHECKOUT,
  TRACK_COMPLETED_REGISTRATION,
  TRACK_SEARCH,
  TRACK_SCROLL_TOP,
  TRACK_ADDED_PAYMENT_INFO,
  TRACK_SELECTED_PAYMENT_INFO,
  TRACK_SMARTBANNER,
  TRACK_FILTER_LIVE_SUGGEST,
  TRACK_QR_SCANNER,
  TRACK_AD_SCANNER,
  TRACK_CC_SCANNER,
  TRACK_OPEN_DEEP_LINK,
  TRACK_OPEN_UNIVERSAL_LINK,
  TRACK_OPEN_DEFERRED_DEEP_LINK,
  TRACK_OPEN_SMART_APP_DOWNLOAD_LINK,
  TRACK_OPEN_PUSH_NOTIFICATION,
  TRACK_APP_REVIEW_PROMPT,
  TRACK_SET_CAMPAIGN_WITH_URL,
  REMOVE_TRACKER,
  ADD_TRACKER,
  TRACK_LOGIN_SUCCESS,
  TRACK_LOGIN_FAILED,
  TRACK_CUSTOM_EVENT,
];
