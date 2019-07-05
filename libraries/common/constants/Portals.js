// FEATURES
const APP = 'app';
const APP_BAR = 'app-bar';
const PAGE = 'page';
const NAV_MENU = 'nav-menu';
const NO_RESULTS = 'no-results';
const USER_MENU = 'user-menu';
const FORM = 'form';

// CONTENTS
const GLOBALS = 'globals';
const ROUTES = 'routes';
const CONTENT = 'content';
const HOME = 'home';
const LOGIN = 'login';
const REGISTER_LINK = 'register-link';
const TERMS = 'terms';
const PRIVACY = 'privacy';
const IMPRINT = 'imprint';
const STORE_INFORMATION = 'store-information';
const STORE_INFORMATION_MORE = 'store-information-more';
const STORE_INFORMATION_ABOUT = 'store-information-about';
const MY_ACCOUNT = 'my-account';
const LOGOUT = 'logout';
const CONTAINER = 'container';
const DEFAULT = 'default';
const BACK = 'back';
const CLOSE = 'close';
const SIMPLE = 'simple';
const CART_BUTTON = 'cart-button';

// POSITIONS
export const BEFORE = 'before';
export const AFTER = 'after';
export const LEFT = 'left';
export const CENTER = 'center';
export const RIGHT = 'right';
export const BELOW = 'below';

export const APP_GLOBALS = `${APP}.${GLOBALS}`;
export const APP_ROUTES = `${APP}.${ROUTES}`;

export const PAGE_CONTENT_BEFORE = `${PAGE}.${CONTENT}.${BEFORE}`;
export const PAGE_CONTENT = `${PAGE}.${CONTENT}`;
export const PAGE_CONTENT_AFTER = `${PAGE}.${CONTENT}.${AFTER}`;

export const PAGE_LOGIN_BEFORE = `${PAGE}.${LOGIN}.${BEFORE}`;
export const PAGE_LOGIN = `${PAGE}.${LOGIN}`;
export const PAGE_LOGIN_AFTER = `${PAGE}.${LOGIN}.${AFTER}`;

export const PAGE_LOGIN_FORM_BEFORE = `${PAGE}.${LOGIN}.${FORM}.${BEFORE}`;
export const PAGE_LOGIN_FORM = `${PAGE}.${LOGIN}.${FORM}`;
export const PAGE_LOGIN_FORM_AFTER = `${PAGE}.${LOGIN}.${FORM}.${AFTER}`;

export const PAGE_LOGIN_REGISTER_LINK_BEFORE = `${PAGE}.${LOGIN}.${REGISTER_LINK}.${BEFORE}`;
export const PAGE_LOGIN_REGISTER_LINK = `${PAGE}.${LOGIN}.${REGISTER_LINK}`;
export const PAGE_LOGIN_REGISTER_LINK_AFTER = `${PAGE}.${LOGIN}.${REGISTER_LINK}.${AFTER}`;

export const NAV_MENU_CONTENT_BEFORE = `${NAV_MENU}.${CONTENT}.${BEFORE}`;
export const NAV_MENU_CONTENT_AFTER = `${NAV_MENU}.${CONTENT}.${AFTER}`;

export const NAV_MENU_HOME_BEFORE = `${NAV_MENU}.${HOME}.${BEFORE}`;
export const NAV_MENU_HOME = `${NAV_MENU}.${HOME}`;
export const NAV_MENU_HOME_AFTER = `${NAV_MENU}.${HOME}.${AFTER}`;

export const NAV_MENU_TERMS_BEFORE = `${NAV_MENU}.${TERMS}.${BEFORE}`;
export const NAV_MENU_TERMS = `${NAV_MENU}.${TERMS}`;
export const NAV_MENU_TERMS_AFTER = `${NAV_MENU}.${TERMS}.${AFTER}`;

export const NAV_MENU_PRIVACY_BEFORE = `${NAV_MENU}.${PRIVACY}.${BEFORE}`;
export const NAV_MENU_PRIVACY = `${NAV_MENU}.${PRIVACY}`;
export const NAV_MENU_PRIVACY_AFTER = `${NAV_MENU}.${PRIVACY}.${AFTER}`;

export const NAV_MENU_IMPRINT_BEFORE = `${NAV_MENU}.${IMPRINT}.${BEFORE}`;
export const NAV_MENU_IMPRINT = `${NAV_MENU}.${IMPRINT}`;
export const NAV_MENU_IMPRINT_AFTER = `${NAV_MENU}.${IMPRINT}.${AFTER}`;

export const NAV_MENU_STORE_INFORMATION_BEFORE = `${NAV_MENU}.${STORE_INFORMATION}.${BEFORE}`;
export const NAV_MENU_STORE_INFORMATION = `${NAV_MENU}.${STORE_INFORMATION}`;
export const NAV_MENU_STORE_INFORMATION_AFTER = `${NAV_MENU}.${STORE_INFORMATION}.${AFTER}`;

export const NAV_MENU_STORE_INFORMATION_MORE_BEFORE = `${NAV_MENU}.${STORE_INFORMATION_MORE}.${BEFORE}`;
export const NAV_MENU_STORE_INFORMATION_MORE = `${NAV_MENU}.${STORE_INFORMATION_MORE}`;
export const NAV_MENU_STORE_INFORMATION_MORE_AFTER = `${NAV_MENU}.${STORE_INFORMATION_MORE}.${AFTER}`;

export const NAV_MENU_STORE_INFORMATION_ABOUT_BEFORE = `${NAV_MENU}.${STORE_INFORMATION_ABOUT}.${BEFORE}`;
export const NAV_MENU_STORE_INFORMATION_ABOUT = `${NAV_MENU}.${STORE_INFORMATION_ABOUT}`;
export const NAV_MENU_STORE_INFORMATION_ABOUT_AFTER = `${NAV_MENU}.${STORE_INFORMATION_ABOUT}.${AFTER}`;

export const NAV_MENU_MY_ACCOUNT_BEFORE = `${NAV_MENU}.${MY_ACCOUNT}.${BEFORE}`;
export const NAV_MENU_MY_ACCOUNT = `${NAV_MENU}.${MY_ACCOUNT}`;
export const NAV_MENU_MY_ACCOUNT_AFTER = `${NAV_MENU}.${MY_ACCOUNT}.${AFTER}`;

export const NAV_MENU_LOGOUT_BEFORE = `${NAV_MENU}.${LOGOUT}.${BEFORE}`;
export const NAV_MENU_LOGOUT = `${NAV_MENU}.${LOGOUT}`;
export const NAV_MENU_LOGOUT_AFTER = `${NAV_MENU}.${LOGOUT}.${AFTER}`;

export const NO_RESULTS_CONTENT_BEFORE = `${NO_RESULTS}.${CONTENT}.${BEFORE}`;
export const NO_RESULTS_CONTENT = `${NO_RESULTS}.${CONTENT}`;
export const NO_RESULTS_CONTENT_AFTER = `${NO_RESULTS}.${CONTENT}.${AFTER}`;

export const USER_MENU_CONTAINER_BEFORE = `${USER_MENU}.${CONTAINER}.${BEFORE}`;
export const USER_MENU_CONTAINER = `${USER_MENU}.${CONTAINER}`;
export const USER_MENU_CONTAINER_AFTER = `${USER_MENU}.${CONTAINER}.${AFTER}`;

export const APP_BAR_DEFAULT_BEFORE = `${APP_BAR}.${DEFAULT}.${BEFORE}`;
export const APP_BAR_DEFAULT = `${APP_BAR}.${DEFAULT}`;
export const APP_BAR_DEFAULT_AFTER = `${APP_BAR}.${DEFAULT}.${AFTER}`;

export const APP_BAR_BACK_BEFORE = `${APP_BAR}.${BACK}.${BEFORE}`;
export const APP_BAR_BACK = `${APP_BAR}.${BACK}`;
export const APP_BAR_BACK_AFTER = `${APP_BAR}.${BACK}.${AFTER}`;

export const APP_BAR_CLOSE_BEFORE = `${APP_BAR}.${CLOSE}.${BEFORE}`;
export const APP_BAR_CLOSE = `${APP_BAR}.${CLOSE}`;
export const APP_BAR_CLOSE_AFTER = `${APP_BAR}.${CLOSE}.${AFTER}`;

export const APP_BAR_SIMPLE_BEFORE = `${APP_BAR}.${SIMPLE}.${BEFORE}`;
export const APP_BAR_SIMPLE = `${APP_BAR}.${SIMPLE}`;
export const APP_BAR_SIMPLE_AFTER = `${APP_BAR}.${SIMPLE}.${AFTER}`;

export const APP_BAR_LEFT = `${APP_BAR}.${LEFT}`;
export const APP_BAR_LEFT_BEFORE = `${APP_BAR}.${LEFT}.${BEFORE}`;
export const APP_BAR_LEFT_AFTER = `${APP_BAR}.${LEFT}.${AFTER}`;

export const APP_BAR_CENTER = `${APP_BAR}.${CENTER}`;
export const APP_BAR_CENTER_BEFORE = `${APP_BAR}.${CENTER}.${BEFORE}`;
export const APP_BAR_CENTER_AFTER = `${APP_BAR}.${CENTER}.${AFTER}`;

export const APP_BAR_RIGHT = `${APP_BAR}.${RIGHT}`;
export const APP_BAR_RIGHT_BEFORE = `${APP_BAR}.${RIGHT}.${BEFORE}`;
export const APP_BAR_RIGHT_AFTER = `${APP_BAR}.${RIGHT}.${AFTER}`;

export const APP_BAR_BELOW = `${APP_BAR}.${BELOW}`;
export const APP_BAR_BELOW_BEFORE = `${APP_BAR}.${BELOW}.${BEFORE}`;
export const APP_BAR_BELOW_AFTER = `${APP_BAR}.${BELOW}.${AFTER}`;

export const APP_BAR_CART_BUTTON = `${APP_BAR}.${CART_BUTTON}`;
export const APP_BAR_CART_BUTTON_BEFORE = `${APP_BAR}.${CART_BUTTON}.${BEFORE}`;
export const APP_BAR_CART_BUTTON_AFTER = `${APP_BAR}.${CART_BUTTON}.${AFTER}`;
