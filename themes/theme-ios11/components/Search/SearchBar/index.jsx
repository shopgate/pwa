import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { PERSISTENT_SEARCH_BAR_INPUT_WRAPPER } from '@shopgate/engage/search/constants';
import { SearchTrigger } from '../SearchField';
import { useOverlayScroll } from '../../AppBar/hooks';

const HEIGHT_VAR = '--sg-search-bar-height';
const OFFSET_VAR = '--sg-search-bar-offset';

const useStyles = makeStyles()(theme => ({
  clip: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.5, 2, 1),
    background: theme.components.appBar.background,
    pointerEvents: 'auto',
    transition: theme.transitions.create(['transform', 'opacity'], { duration: 200 }),
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  floating: {
    background: 'transparent',
  },
  collapsed: {
    transform: 'translateY(-100%)',
    opacity: 0,
    pointerEvents: 'none',
  },
}));

/**
 * The search field below the header. It overlays the content, which leaves room for it at the
 * top, and slides away while scrolling down without moving the content.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const SearchBar = ({ query, hideOnScroll, overlay }) => {
  const { classes, cx } = useStyles();
  const barRef = useRef(null);
  const { scrollingDown } = useOverlayScroll(hideOnScroll);
  const collapsed = hideOnScroll && scrollingDown;

  useLayoutEffect(() => {
    const height = barRef.current?.offsetHeight || 0;
    const { style } = document.documentElement;
    style.setProperty(HEIGHT_VAR, overlay ? '0px' : `${height}px`);
    style.setProperty(OFFSET_VAR, overlay || collapsed ? '0px' : `${height}px`);

    return () => {
      style.removeProperty(HEIGHT_VAR);
      style.removeProperty(OFFSET_VAR);
    };
  }, [collapsed, overlay]);

  return (
    <div className={classes.clip}>
      <div
        ref={barRef}
        className={cx(
          classes.bar,
          overlay && classes.floating,
          collapsed && classes.collapsed,
          'theme__search-bar'
        )}
        aria-hidden={collapsed || undefined}
      >
        <SurroundPortals portalName={PERSISTENT_SEARCH_BAR_INPUT_WRAPPER}>
          <SearchTrigger query={query} />
        </SurroundPortals>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  hideOnScroll: PropTypes.bool,
  overlay: PropTypes.bool,
  query: PropTypes.string,
};

SearchBar.defaultProps = {
  hideOnScroll: false,
  overlay: false,
  query: '',
};

export default SearchBar;
