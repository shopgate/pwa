/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Directly send and receive any request without further processing.
export const PROCESS_ANY = 'any';

// Handle the first response that was received and ignore any cached request.
export const PROCESS_FIRST_RESPONSE = 'first_response';

// Wait for the result of the last request until processing the queued requests.
export const PROCESS_LAST_REQUEST = 'last_request';

// Process responses in order of request.
export const PROCESS_ORDERED_REQUEST = 'ordered_request';

// Queue requests until the previous response has been received.
export const PROCESS_SEQUENTIALLY = 'sequentially';

// Reject any queued response that is not the awaited one.
export const PROPAGATE_REJECT = 'reject';

// Propagate only the awaited response to all enqueued requests.
export const PROPAGATE_SINGLE = 'single';
