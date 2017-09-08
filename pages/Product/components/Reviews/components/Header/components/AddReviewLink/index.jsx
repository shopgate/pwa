/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import style from './style';

/**
 * Link to add a review
 * @constructor
 */
const AddReviewLink = () => (
  <Link href="/" className={style.button}>
    <I18n.Text string="reviews.button_add" />
  </Link>
);

export default AddReviewLink;
