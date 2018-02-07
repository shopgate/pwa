/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// FEATURES
const APP = 'app';
const PAGE = 'page';

// CONTENTS
const ROUTES = 'routes';
const CONTENT = 'content';

// POSITIONS
const BEFORE = 'before';
const AFTER = 'after';

export const APP_ROUTES = `${APP}.${ROUTES}`;
export const PAGE_CONTENT_BEFORE = `${PAGE}.${CONTENT}.${BEFORE}`;
export const PAGE_CONTENT_AFTER = `${PAGE}.${CONTENT}.${AFTER}`;
export const PAGE_CONTENT = `${PAGE}.${CONTENT}`;
