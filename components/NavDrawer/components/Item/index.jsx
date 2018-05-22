import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { history } from '@shopgate/pwa-common/helpers/router';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import Grid from '@shopgate/pwa-common/components/Grid';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';
import styles from './style';

// Add some delay to the click event to show the ripple effect.
const CLICK_DELAY = 250;

/**
 * Handles an Item click by executing it's href.
 * @param {Object} props The component props.
 * @param {string} props.href A url string.
 * @param {string} props.link A url string (compatibility with `NAV_MENU_CONTENT_BEFORE` portal).
 * @param {Function} props.close A callback.
 */
const handleClick = ({
  onClick, href, link, close,
}) => {
  setTimeout(() => {
    const url = href || link;
    // Perform onClick callback
    onClick();

    if (url) {
      // Open parsed link
      new ParsedLink(url).open(history);
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
  const className = classNames(styles.container, {
    [styles.primary]: props.primary,
  });

  const labelClassName =
          props.withIndicator && !props.count ? styles.labelWithIndicator : styles.label;

  return (
    <div
      aria-hidden
      className={className}
      data-test-id="NavDrawerLink"
      onClick={() => handleClick(props)}
    >
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
