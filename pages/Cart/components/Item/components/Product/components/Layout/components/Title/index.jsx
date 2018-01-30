/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import ContextMenu from 'Components/ContextMenu';
import styles from './style';

/**
 * The Cart Product Title component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Title = ({ value, handleRemove, toggleEditMode }) => (
  <Grid>
    <Grid.Item grow={1}>
      <div className={styles.title}>
        {value}
      </div>
    </Grid.Item>
    <Grid.Item className={styles.menuContainer} shrink={0}>
      <div className={styles.menuToggle}>
        <ContextMenu>
          <ContextMenu.Item onClick={handleRemove}>
            <I18n.Text string="cart.remove" />
          </ContextMenu.Item>
          <ContextMenu.Item onClick={() => toggleEditMode(true)}>
            <I18n.Text string="cart.edit" />
          </ContextMenu.Item>
        </ContextMenu>
      </div>
    </Grid.Item>
  </Grid>
);

Title.propTypes = {
  value: PropTypes.string.isRequired,
  handleRemove: PropTypes.func,
  toggleEditMode: PropTypes.func,
};

Title.defaultProps = {
  handleRemove: () => {},
  toggleEditMode: () => {},
};

export default Title;
