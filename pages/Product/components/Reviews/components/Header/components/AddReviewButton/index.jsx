/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import Button from '../../../../../../../../components/Button';

/**
 * Button to add a review
 * @constructor
 */
const AddReviewButton = () => (
  <Button type="secondary" flat={!0}>
    <I18n.Text string="reviews.button_add" />
  </Button>
);

export default AddReviewButton;
