/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * Returns mocked pipeline request which resolve immediately with a non-empty list.
 * #favPipelines
 * @returns {Promise}
 */
export default function PipelineRequest() {
  this.dispatch = () => new Promise(resolve => resolve({ products: [] }));

  return this;
}
