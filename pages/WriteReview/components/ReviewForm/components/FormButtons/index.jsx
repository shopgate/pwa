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
import buttonStyles from 'Components/Button/style';
import styles from './style';
import connect from './connector';

/**
 * The form buttons component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormButtons = (props) => {
  const buttonStyle = buttonStyles.regular(false);
  return (
    <div className={styles.buttonLine}>
      <button
        type="button"
        className={`${buttonStyle.button} ${buttonStyle.content}`}
        onClick={props.cancel}
      >
        <I18n.Text string="common.cancel" />
      </button>
      <RippleButton type="secondary" disabled={props.isLoading}>
        <I18n.Text string="common.submit" />
      </RippleButton>
    </div>
  );
};

FormButtons.propTypes = {
  cancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

FormButtons.defaultProps = {
  isLoading: false,
};

export default connect(FormButtons);
