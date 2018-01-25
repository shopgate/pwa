/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { history } from '@shopgate/pwa-common/helpers/router';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import Grid from '@shopgate/pwa-common/components/Grid';
import Ripple from 'Components/Ripple';
import styles from './style';

// Add some delay to the click event to show the ripple effect.
const CLICK_DELAY = 250;

/**
 * Handles an Item click by executing it's href.
 * @param {Object} props The component props.
 * @param {string} props.href A url string.
 * @param {Function} props.close A callback.
 */
const handleClick = ({ onClick, href, close }) => {
  setTimeout(() => {
    // Perform onClick callback
    onClick();

    if (href) {
      // Open parsed link
      new ParsedLink(href).open(history);
    }

    // Call close callback from drawer
    close();
  }, CLICK_DELAY);
};
/**
 * The Item component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Item = (props) => {
  const className = classNames(
    styles.container, {
      [styles.primary]: props.primary,
    }
  );

  const labelClassName =
          props.withIndicator && !props.count ? styles.labelWithIndicator : styles.label;

  return (
    <div className={className} onClick={() => handleClick(props)} aria-hidden>
      <Ripple fill>
        <Grid className={styles.grid}>
          <Grid.Item>
            <div className={styles.icon}>
              {props.icon && React.createElement(
                props.icon,
                {
                  ...props.primary && { className: styles.primaryIcon },
                }
              )}
            </div>
          </Grid.Item>
          <Grid.Item grow={1}>
            <div className={labelClassName}>
              {props.children}
            </div>
          </Grid.Item>
          {props.count && (
            <Grid.Item>
              <div className={styles.count}>
                {props.count}
              </div>
            </Grid.Item>
          )}
        </Grid>
      </Ripple>
    </div>
  );
};

Item.propTypes = {
  children: PropTypes.node,
  close: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  count: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  href: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  icon: PropTypes.func,
  onClick: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  primary: PropTypes.bool,
  withIndicator: PropTypes.bool,
};

Item.defaultProps = {
  children: null,
  close: () => {},
  count: null,
  href: '',
  icon: null,
  onClick: () => {},
  primary: false,
  withIndicator: false,
};

export default Item;
