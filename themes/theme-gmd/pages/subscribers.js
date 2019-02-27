// PWA Common
import commonApp from '@shopgate/pwa-common/subscriptions/app';
import commonUser from '@shopgate/pwa-common/subscriptions/user';
import commonHistory from '@shopgate/pwa-common/subscriptions/history';
import commonMenu from '@shopgate/pwa-common/subscriptions/menu';
import commonRouter from '@shopgate/pwa-common/subscriptions/router';
import commonErrors from '@shopgate/pwa-common/subscriptions/error';
// PWA Common Commerce
import commerceCart from '@shopgate/pwa-common-commerce/cart/subscriptions';
import commerceCheckout from '@shopgate/pwa-common-commerce/checkout/subscriptions';
import commerceFavorites from '@shopgate/pwa-common-commerce/favorites/subscriptions';
import commerceFilter from '@shopgate/pwa-common-commerce/filter/subscriptions';
import commerceProduct from '@shopgate/pwa-common-commerce/product/subscriptions';
import commerceReviews from '@shopgate/pwa-common-commerce/reviews/subscriptions';
import commerceSearch from '@shopgate/pwa-common-commerce/search/subscriptions';
// PWA Tracking
import trackingSetup from '@shopgate/pwa-tracking/subscriptions/setup';
import trackingPages from '@shopgate/pwa-tracking/subscriptions/pages';
import trackingProduct from '@shopgate/pwa-tracking/subscriptions/product';
import trackingUser from '@shopgate/pwa-tracking/subscriptions/user';
import trackingCart from '@shopgate/pwa-tracking/subscriptions/cart';
import trackingCheckout from '@shopgate/pwa-tracking/subscriptions/checkout';
import trackingSearch from '@shopgate/pwa-tracking/subscriptions/search';
import trackingDeeplinkPush from '@shopgate/pwa-tracking/subscriptions/deeplinkPush';
// Theme
import app from 'Pages/subscriptions';
import viewport from 'Components/Viewport/subscriptions';
import rootCategory from 'Pages/RootCategory/subscriptions';
import category from 'Pages/Category/subscriptions';
import coupon from 'Pages/Cart/components/CouponField/subscriptions';
import favorites from 'Pages/Favorites/subscriptions';
import login from 'Pages/Login/subscriptions';
import startPage from 'Pages/StartPage/subscriptions';
import page from 'Pages/Page/subscriptions';
import search from 'Pages/Search/subscriptions';
import reviews from 'Pages/Reviews/subscriptions';
import writeReview from 'Pages/WriteReview/subscriptions';
import appConfig from '@shopgate/pwa-common/helpers/config';
// Extensions
import extensions from 'Extensions/subscribers';

const subscriptions = [
  // Common subscribers.
  commonApp,
  commonHistory,
  commonUser,
  commonMenu,
  commonRouter,
  commonErrors,
  // Tracking subscribers.
  trackingSetup,
  trackingPages,
  trackingProduct,
  trackingUser,
  trackingCart,
  trackingCheckout,
  trackingSearch,
  trackingDeeplinkPush,
  // Common Commerce subscribers.
  commerceCart,
  commerceCheckout,
  commerceFavorites,
  commerceFilter,
  commerceProduct,
  commerceReviews,
  commerceSearch,
  // Theme subscribers.
  app,
  viewport,
  rootCategory,
  category,
  coupon,
  favorites,
  login,
  startPage,
  page,
  search,
  reviews,
  writeReview,
  // Extensions
  ...extensions,
];

if (appConfig.webCheckoutShopify !== null) {
  // eslint-disable-next-line global-require
  subscriptions.push(require('@shopgate/pwa-webcheckout-shopify/subscriptions').default);
}

export default subscriptions;
