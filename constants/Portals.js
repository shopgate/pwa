/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// FEATURES
const APP = 'app';
const PAGE = 'page';
const NAV_MENU = 'nav-menu';
const NO_RESULTS = 'no-results';

// CONTENTS
const GLOBALS = 'globals';
const ROUTES = 'routes';
const HEADER = 'header';
const CONTENT = 'content';
const HOME = 'home';
const SHIPPING = 'shipping';
const PAYMENT = 'payment';
const TERMS = 'terms';
const PRIVACY = 'privacy';
const RETURN_POLICY = 'return-policy';
const IMPRINT = 'imprint';
const LOGOUT = 'logout';

// POSITIONS
const BEFORE = 'before';
const AFTER = 'after';

export const APP_GLOBALS = `${APP}.${GLOBALS}`;
export const APP_ROUTES = `${APP}.${ROUTES}`;

export const PAGE_CONTENT_BEFORE = `${PAGE}.${CONTENT}.${BEFORE}`;
export const PAGE_CONTENT = `${PAGE}.${CONTENT}`;
export const PAGE_CONTENT_AFTER = `${PAGE}.${CONTENT}.${AFTER}`;

export const NAV_MENU_HEADER_BEFORE = `${NAV_MENU}.${HEADER}.${BEFORE}`;
export const NAV_MENU_HEADER = `${NAV_MENU}.${HEADER}`;
export const NAV_MENU_HEADER_AFTER = `${NAV_MENU}.${HEADER}.${AFTER}`;

export const NAV_MENU_CONTENT_BEFORE = `${NAV_MENU}.${CONTENT}.${BEFORE}`;
export const NAV_MENU_CONTENT_AFTER = `${NAV_MENU}.${CONTENT}.${AFTER}`;

export const NAV_MENU_HOME_BEFORE = `${NAV_MENU}.${HOME}.${BEFORE}`;
export const NAV_MENU_HOME = `${NAV_MENU}.${HOME}`;
export const NAV_MENU_HOME_AFTER = `${NAV_MENU}.${HOME}.${AFTER}`;

export const NAV_MENU_SHIPPING_BEFORE = `${NAV_MENU}.${SHIPPING}.${BEFORE}`;
export const NAV_MENU_SHIPPING = `${NAV_MENU}.${SHIPPING}`;
export const NAV_MENU_SHIPPING_AFTER = `${NAV_MENU}.${SHIPPING}.${AFTER}`;

export const NAV_MENU_PAYMENT_BEFORE = `${NAV_MENU}.${PAYMENT}.${BEFORE}`;
export const NAV_MENU_PAYMENT = `${NAV_MENU}.${PAYMENT}`;
export const NAV_MENU_PAYMENT_AFTER = `${NAV_MENU}.${PAYMENT}.${AFTER}`;

export const NAV_MENU_TERMS_BEFORE = `${NAV_MENU}.${TERMS}.${BEFORE}`;
export const NAV_MENU_TERMS = `${NAV_MENU}.${TERMS}`;
export const NAV_MENU_TERMS_AFTER = `${NAV_MENU}.${TERMS}.${AFTER}`;

export const NAV_MENU_PRIVACY_BEFORE = `${NAV_MENU}.${PRIVACY}.${BEFORE}`;
export const NAV_MENU_PRIVACY = `${NAV_MENU}.${PRIVACY}`;
export const NAV_MENU_PRIVACY_AFTER = `${NAV_MENU}.${PRIVACY}.${AFTER}`;

export const NAV_MENU_RETURN_POLICY_BEFORE = `${NAV_MENU}.${RETURN_POLICY}.${BEFORE}`;
export const NAV_MENU_RETURN_POLICY = `${NAV_MENU}.${RETURN_POLICY}`;
export const NAV_MENU_RETURN_POLICY_AFTER = `${NAV_MENU}.${RETURN_POLICY}.${AFTER}`;

export const NAV_MENU_IMPRINT_BEFORE = `${NAV_MENU}.${IMPRINT}.${BEFORE}`;
export const NAV_MENU_IMPRINT = `${NAV_MENU}.${IMPRINT}`;
export const NAV_MENU_IMPRINT_AFTER = `${NAV_MENU}.${IMPRINT}.${AFTER}`;

export const NAV_MENU_LOGOUT_BEFORE = `${NAV_MENU}.${LOGOUT}.${BEFORE}`;
export const NAV_MENU_LOGOUT = `${NAV_MENU}.${LOGOUT}`;
export const NAV_MENU_LOGOUT_AFTER = `${NAV_MENU}.${LOGOUT}.${AFTER}`;

export const NO_RESULTS_CONTENT_BEFORE = `${NO_RESULTS}.${CONTENT}.${BEFORE}`;
export const NO_RESULTS_CONTENT = `${NO_RESULTS}.${CONTENT}`;
export const NO_RESULTS_CONTENT_AFTER = `${NO_RESULTS}.${CONTENT}.${AFTER}`;
