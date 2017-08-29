import React, { PropTypes } from 'react';
import cxs from 'cxs';
import { colors } from 'Templates/styles';
import { Icon } from 'Library/components';

const iconCircleEnabled = cxs({
  fill: colors.primary,
});

const iconArrowEnabled = cxs({
  fill: colors.light,
});

const iconCircleDisabled = cxs({
  fill: colors.shade7,
});

const iconArrowDisabled = cxs({
  fill: colors.shade4,
});

/**
 * Coupon field add icon.
 * @props {Object} props The component props.
 * @returns {JSX}
 */
const CardFieldButtonIcon = ({ disabled, ...props }) => {
  const styles = {
    circle: disabled ? iconCircleDisabled : iconCircleEnabled,
    arrow: disabled ? iconArrowDisabled : iconArrowEnabled,
  };

  const content = `
    <g transform="translate(1357 5547)">
      <g>
        <path 
          class="${styles.circle}"
          d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Z"
          transform="translate(314 377)"
        />
        <path 
          class="${styles.arrow}"
          d="M20,11H7.8l5.6-5.6L12,4,4,12l8,8,1.4-1.4L7.8,13H20V11Z"
          transform="translate(341 404) rotate(180)"
        />
      </g>
    </g>
  `;

  return (
    <Icon viewBox="1671 5924 30 30" content={content} {...props} />
  );
};

CardFieldButtonIcon.propTypes = {
  disabled: PropTypes.bool,
};

CardFieldButtonIcon.defaultProps = {
  disabled: false,
};

export default CardFieldButtonIcon;
