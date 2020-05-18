import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n, ArrowIcon } from '@shopgate/engage/components';
import { useNavigation } from '@shopgate/engage/core';
import { container, button, buttonIcon } from './ResponsiveBackButton.style';

/**
 * A back button  for the desktop checkout pages.
 * @returns {JSX}
 */
const ResponsiveBackButton = ({ label, onClick }) => {
  const { pop } = useNavigation();

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
      return;
    }

    pop();
  }, [onClick, pop]);

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
  onClick: PropTypes.func,
};

ResponsiveBackButton.defaultProps = {
  label: 'common.back',
  onClick: null,
};

export default ResponsiveBackButton;
