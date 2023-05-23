import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { Ripple } from '@shopgate/engage/components';
import CrossIcon from '@shopgate/pwa-ui-shared/icons/CrossIcon';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const styles = {
  root: css({
    display: 'flex',
    background: themeColors.light,
    borderRadius: '50%',
    border: 'solid',
    borderWidth: 1,
    padding: 0,
    fontSize: 15,
    lineHeight: 1,
    outline: 0,
    height: 20,
    width: 20,
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
    aria-label={i18n.text('favorites.remove')}
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
