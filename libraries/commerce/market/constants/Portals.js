/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// FEATURES
const NAV_MENU = 'nav-menu';

// CONTENTS
const SHIPPING = 'shipping';
const PAYMENT = 'payment';
const RETURN_POLICY = 'return-policy';

// POSITIONS
const BEFORE = 'before';
const AFTER = 'after';

export const NAV_MENU_SHIPPING_BEFORE = `${NAV_MENU}.${SHIPPING}.${BEFORE}`;
export const NAV_MENU_SHIPPING = `${NAV_MENU}.${SHIPPING}`;
export const NAV_MENU_SHIPPING_AFTER = `${NAV_MENU}.${SHIPPING}.${AFTER}`;

export const NAV_MENU_PAYMENT_BEFORE = `${NAV_MENU}.${PAYMENT}.${BEFORE}`;
export const NAV_MENU_PAYMENT = `${NAV_MENU}.${PAYMENT}`;
export const NAV_MENU_PAYMENT_AFTER = `${NAV_MENU}.${PAYMENT}.${AFTER}`;

export const NAV_MENU_RETURN_POLICY_BEFORE = `${NAV_MENU}.${RETURN_POLICY}.${BEFORE}`;
export const NAV_MENU_RETURN_POLICY = `${NAV_MENU}.${RETURN_POLICY}`;
export const NAV_MENU_RETURN_POLICY_AFTER = `${NAV_MENU}.${RETURN_POLICY}.${AFTER}`;
