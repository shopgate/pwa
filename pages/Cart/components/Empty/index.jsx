/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import RippleButton from 'Components/RippleButton';
import Icon from './components/Icon';
import connect from './connector';
import styles from './style';

/**
 * The Cart Empty component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Empty = ({ goBackHistory }) => (
  <div className={styles.wrapper}>
    <div className={styles.container}>
      <div className={styles.icon}>
        <Icon />
      </div>
      <div className={styles.title}>
        <I18n.Text string="cart.empty" />
      </div>
    </div>
    <div className={styles.buttonContainer}>
      <RippleButton onClick={goBackHistory} className={styles.button} type="secondary">
        <I18n.Text string="cart.continue" />
      </RippleButton>
    </div>
  </div>
);

Empty.propTypes = {
  goBackHistory: PropTypes.func.isRequired,
};

export default connect(Empty);
