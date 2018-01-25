/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import RippleButton from 'Components/RippleButton';
import connect from './connector';
import styles from './style';

class ContinueButton extends Component {
  static propTypes = {
    goBackHistory: PropTypes.func.isRequired,
  };

  render() {
    return (
      <RippleButton onClick={this.props.goBackHistory} className={styles.button} type="secondary">
        <I18n.Text string="favorites.continue" />
      </RippleButton>
    );
  }
}

export default connect(ContinueButton);
