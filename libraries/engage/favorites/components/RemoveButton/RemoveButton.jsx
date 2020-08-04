import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { Ripple } from '@shopgate/engage/components';
import CrossIcon from '@shopgate/pwa-ui-shared/icons/CrossIcon';
import { themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';

const styles = {
  root: css({
    display: 'flex',
    position: 'relative',
    background: themeColors.light,
    borderRadius: '50%',
    padding: 0,
    fontSize: 20,
    lineHeight: 1,
    color: `var(--color-secondary, ${themeColors.accent})`,
    outline: 0,
    boxShadow: themeShadows.buttons.elevated,
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  }).toString(),
};

/**
 * The remove favorites button component.
 * @returns {JSX}
 */
const RemoveButton = ({ onClick }) => (
  <button
    className={styles.root}
    onClick={onClick}
    type="button"
  >
    <Ripple>
      <CrossIcon className={styles.icon} />
    </Ripple>
  </button>
);

RemoveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default RemoveButton;
