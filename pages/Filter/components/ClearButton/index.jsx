/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import I18n from '@shopgate/pwa-common/components/I18n';
import Button from 'Components/Button';
import connect from './connector';
import styles from './style';

/**
 * The Filter List Item Clear Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ClearButton = pure(({ hasFilters, removeAllTemporaryFilters }) => (
  <div className={styles}>
    <Button
      flat
      type="regular"
      onClick={() => removeAllTemporaryFilters()}
      disabled={!hasFilters}
    >
      <I18n.Text string="filter.clear_all" />
    </Button>
  </div>
));

ClearButton.propTypes = {
  hasFilters: PropTypes.boolean.isRequired,
  removeAllTemporaryFilters: PropTypes.func.isRequired,
};

export default connect(ClearButton);
