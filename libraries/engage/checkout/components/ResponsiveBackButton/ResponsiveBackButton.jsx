import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n, ArrowIcon } from '@shopgate/engage/components';
import { useNavigation } from '@shopgate/engage/core';
import { container, button, buttonIcon } from './ResponsiveBackButton.style';

/**
 * A back button  for the desktop checkout pages.
 * @returns {JSX}
 */
const ResponsiveBackButton = ({ label }) => {
  const { pop } = useNavigation();

  const handleClick = useCallback(() => {
    pop();
  }, [pop]);

  return (
    <div className={container}>
      <RippleButton
        flat
        className={button}
        type="secondary"
        onClick={handleClick}
      >
        <ArrowIcon className={buttonIcon} />
        <I18n.Text string={label} />
      </RippleButton>
    </div>
  );
};

ResponsiveBackButton.propTypes = {
  label: PropTypes.string,
};

ResponsiveBackButton.defaultProps = {
  label: 'common.back',
};

export default ResponsiveBackButton;
