/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import View from 'Components/View';
import ReviewForm from './components/ReviewForm';

/**
 * The view that holds a review form.
 * @return {JSX}
 * @constructor
 */
const WriteReview = () => {
  return (
    <View>
      <ReviewForm />
    </View>
  );
};

export default WriteReview;
