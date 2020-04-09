import React from 'react';
import PropTypes from 'prop-types';
import { View } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { CrossIcon } from '@shopgate/pwa-ui-shared';
import { DefaultBar } from 'Components/AppBar/presets';
import { CheckoutConfirmation as Content } from '@shopgate/engage/checkout';
import { i18n } from '@shopgate/engage/core';
import connect from './CheckoutConfirmation.connector';

const { colors } = themeConfig;

/**
 * The Cart component.
 * @returns {JSX}
 */
const CheckoutConfirmation = ({ handleClose }) => {
  const left = <DefaultBar.Icon aria-label={i18n.text('common.close')} icon={CrossIcon} onClick={handleClose} />;
  return (
    <View background={colors.background} aria-hidden={false}>
      <DefaultBar
        left={left}
        center={
          <AppBar.Title title={i18n.text('titles.checkout_confirmation')} />
        }
        right={null}
      />
      <Content onContinueShopping={handleClose} />
    </View>
  );
};

CheckoutConfirmation.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default connect(CheckoutConfirmation);

