import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { hasWebBridge } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  link: {
    padding: 0,
    margin: 0,
    border: 'none',
    textAlign: 'left',
    alignItems: 'stretch',
    width: '100%',
    cursor: 'pointer',
  },
});

/**
 * Link component.
 * @param {Object} props Props for the component.
 * @returns {JSX.Element}
 */
const Link = ({
  children,
  historyPush,
  historyReplace,
  href,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
  className,
  disabled,
  replace,
  role,
  state,
  tabIndex,
  tag,
  target,
}) => {
  const { classes } = useStyles();

  const handleOpenLink = useCallback((e) => {
    e.preventDefault();
    if (disabled) {
      return;
    }

    const params = {
      pathname: href,
      state: {
        ...(state || {}),
        ...(target ? { target } : {}),
      },
    };

    setTimeout(() => {
      if (replace) {
        historyReplace(params);
      } else {
        historyPush(params);
      }
    }, 0);
  }, [disabled, href, historyPush, historyReplace, replace, state, target]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleOpenLink(event);
    }
  }, [handleOpenLink]);

  let Tag = tag;

  if (!hasWebBridge() && tag === 'a') {
    Tag = 'span';
  }

  return (
    <Tag
      className={`${classes.link} ${className} common__link`}
      onClick={handleOpenLink}
      onKeyDown={handleKeyDown}
      role={role}
      data-test-id={`link: ${href}`}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
      href={href && Tag === 'a' ? href : null}
    >
      {children}
    </Tag>
  );
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  historyPush: PropTypes.func.isRequired,
  historyReplace: PropTypes.func.isRequired,
  href: PropTypes.string.isRequired,
  'aria-hidden': PropTypes.bool,
  'aria-label': PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  replace: PropTypes.bool,
  role: PropTypes.string,
  state: PropTypes.shape(),
  tabIndex: PropTypes.number,
  tag: PropTypes.string,
  target: PropTypes.string,
};

Link.defaultProps = {
  'aria-hidden': null,
  'aria-label': null,
  className: '',
  disabled: false,
  replace: false,
  role: 'link',
  tag: 'div',
  tabIndex: null,
  target: null,
  state: {},
};

export const Disconnected = Link;

export default connect(Link);
