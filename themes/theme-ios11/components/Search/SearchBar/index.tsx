import { useLayoutEffect, useRef } from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import {
  PERSISTENT_SEARCH_BAR,
  PERSISTENT_SEARCH_BAR_INPUT_WRAPPER,
} from '@shopgate/engage/search/constants';
import SearchTrigger from '../SearchTrigger';
import { useOverlayScroll } from '../../AppBar/hooks';
import {
  SEARCH_BAR_FLOATING_HEIGHT_VAR,
  SEARCH_BAR_HEIGHT_VAR,
  SEARCH_BAR_OFFSET_VAR,
} from '../../AppBar/constants';

const useStyles = makeStyles()(theme => ({
  clip: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    overflow: 'hidden',
    '&&': {
      pointerEvents: 'none',
    },
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.5, 2, 1),
    background: theme.components.appBar.background,
    '&&': {
      pointerEvents: 'auto',
    },
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
    '&&': {
      pointerEvents: 'none',
    },
  },
}));

interface Props {
  /** The search phrase of the page. */
  query?: string;
  hideOnScroll?: boolean;
  /** Whether the bar floats over the content together with the header. */
  overlay?: boolean;
}

/**
 * The search field below the header. It overlays the content, which leaves room for it at the
 * top, and slides away while scrolling down without moving the content.
 * @param props The component props.
 * @param props.query The search phrase of the page.
 * @param props.hideOnScroll Whether the bar slides away while scrolling down.
 * @param props.overlay Whether the bar floats over the content together with the header.
 * @returns The search bar.
 */
const SearchBar = ({ query = '', hideOnScroll = false, overlay = false }: Props) => {
  const { classes, cx } = useStyles();
  const barRef = useRef<HTMLDivElement>(null);
  const { scrollingDown } = useOverlayScroll(hideOnScroll);
  const collapsed = hideOnScroll && scrollingDown;

  useLayoutEffect(() => {
    const bar = barRef.current;
    const height = `${bar?.offsetHeight || 0}px`;
    const visibleHeight = collapsed ? '0px' : height;
    const { style } = document.documentElement;
    style.setProperty(SEARCH_BAR_HEIGHT_VAR, overlay ? '0px' : height);
    style.setProperty(SEARCH_BAR_OFFSET_VAR, overlay ? '0px' : visibleHeight);
    style.setProperty(SEARCH_BAR_FLOATING_HEIGHT_VAR, overlay ? visibleHeight : '0px');
    bar?.toggleAttribute('inert', collapsed);

    return () => {
      style.removeProperty(SEARCH_BAR_HEIGHT_VAR);
      style.removeProperty(SEARCH_BAR_OFFSET_VAR);
      style.removeProperty(SEARCH_BAR_FLOATING_HEIGHT_VAR);
    };
  }, [collapsed, overlay]);

  return (
    <div className={classes.clip}>
      <SurroundPortals portalName={PERSISTENT_SEARCH_BAR} portalProps={{ query }}>
        <div
          ref={barRef}
          className={cx(
            classes.bar,
            overlay && classes.floating,
            collapsed && classes.collapsed,
            'theme__search-bar'
          )}
          data-floating={overlay ? true : undefined}
          data-collapsed={collapsed ? true : undefined}
          aria-hidden={collapsed || undefined}
        >
          <SurroundPortals portalName={PERSISTENT_SEARCH_BAR_INPUT_WRAPPER}>
            <SearchTrigger query={query} />
          </SurroundPortals>
        </div>
      </SurroundPortals>
    </div>
  );
};

export default SearchBar;
