import {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import type { TouchEvent } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { getCurrentPathname, getCurrentRoute } from '@shopgate/engage/core/selectors';
import { RouteContext } from '@shopgate/pwa-common/context';
import {
  CATEGORY_DRAWER,
  CATEGORY_DRAWER_HEADER,
  OPEN_CATEGORY_DRAWER,
} from '@shopgate/engage/category/constants';
import { i18n } from '@shopgate/engage/core/helpers';
import { UIEvents } from '@shopgate/engage/core/events';
import { useNavigation } from '@shopgate/engage/core/hooks';
import { useTrackModalState } from '@shopgate/engage/a11y/hooks';
import { ArrowIcon, CrossIcon, SurroundPortals } from '@shopgate/engage/components';
import { useCategorySettings } from '@shopgate/engage/category/hooks';
import { makeStyles, keyframes } from '@shopgate/engage/styles';
import Level from './Level';
import {
  animateClose, animateLevels, animateOpen, cancelAnimations, setDragOffset,
} from './animation';
import { getContextCategoryId, resolveStartPosition } from './startPosition';
import type { PathEntry, StartPosition } from './types';

const DRAG_START = 10;
const DRAG_CLOSE = 72;

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: theme.zIndex.drawer,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.4)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    width: 'min(86vw, 360px)',
    paddingTop: theme.layout.safeArea.top,
    paddingLeft: theme.layout.safeArea.left,
    background: theme.palette.background.surface,
    color: theme.palette.text.primary,
    touchAction: 'pan-y',
    willChange: 'transform',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    minHeight: 56,
    padding: theme.spacing(0, 0.5),
    borderBottom: `1px solid ${theme.components.separatorLine.borderColor}`,
  },
  title: {
    flexGrow: 1,
    minWidth: 0,
    margin: 0,
    padding: theme.spacing(0, 1.5),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '1.125rem',
    fontWeight: theme.typography.fontWeightBold,
    '[data-has-back] > &': {
      paddingLeft: theme.spacing(0.5),
    },
    '@media (prefers-reduced-motion: no-preference)': {
      animation: `${fadeIn} 220ms ease-out both`,
    },
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 44,
    height: 44,
    border: 0,
    borderRadius: '50%',
    padding: 0,
    background: 'none',
    color: 'inherit',
    fontSize: theme.components.icon.medium,
    '&:active': {
      background: theme.palette.action.pressed,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: -2,
    },
  },
  levels: {
    position: 'relative',
    flexGrow: 1,
    overflow: 'hidden',
  },
}));

interface OpenPayload {
  /** The category the drawer opens at. Without it the drawer follows the current page. */
  categoryId?: string | null;
}

interface LeavingLevel {
  entry: PathEntry | null;
  key: string;
  direction: 1 | -1;
}

const ROOT_POSITION: StartPosition = {
  path: [],
  activeId: null,
};

/**
 * Takes the app below the drawer out of reach of keyboard and screen readers.
 * @param inert Whether the app is out of reach.
 */
const setAppInert = (inert: boolean) => {
  document.getElementById('root')?.toggleAttribute('inert', inert);
};

const getLevelKey = (path: PathEntry[]) => `${path.length}:${path[path.length - 1]?.id ?? ''}`;

/**
 * The category drawer. Opened by the open event. It lists one category level at a time and starts at
 * the category the visitor is in.
 * @returns The drawer, or nothing while it is closed.
 */
const CategoryDrawer = () => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const store = useStore();
  const { push } = useNavigation();
  const pathname = useSelector(getCurrentPathname) as string;
  const route = useSelector(getCurrentRoute);
  const { showImages, showAllProducts } = useCategorySettings();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<StartPosition | null>(null);
  const [path, setPath] = useState<PathEntry[]>([]);
  const [leaving, setLeaving] = useState<LeavingLevel | null>(null);
  const [stagger, setStagger] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const enteringRef = useRef<HTMLDivElement | null>(null);
  const leavingRef = useRef<HTMLDivElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const openedOnRef = useRef<string | null>(null);
  const openGenerationRef = useRef(0);
  const closingRef = useRef(0);
  const dragRef = useRef<{ x: number; y: number; offset: number; active: boolean } | null>(null);

  useTrackModalState(isOpen);

  const close = useCallback((returnFocus = true) => {
    setAppInert(false);
    setIsOpen(false);
    setPosition(null);
    setLeaving(null);
    openedOnRef.current = null;
    closingRef.current = 0;

    if (returnFocus && returnFocusRef.current?.isConnected) {
      returnFocusRef.current.focus();
    }
    returnFocusRef.current = null;
  }, []);

  const closeAnimated = useCallback((returnFocus = true, offset = 0) => {
    if (closingRef.current) {
      return;
    }

    const generation = Date.now();
    closingRef.current = generation;
    animateClose(panelRef.current, backdropRef.current, offset).then(() => {
      if (closingRef.current === generation) {
        close(returnFocus);
      }
    });
  }, [close]);

  useEffect(() => {
    /**
     * @param payload The category the drawer opens at.
     */
    const handleOpen = (payload?: OpenPayload) => {
      if (openedOnRef.current) {
        return;
      }

      const state = store.getState() as object;
      const active = document.activeElement as HTMLElement | null;
      const generation = openGenerationRef.current + 1;
      openGenerationRef.current = generation;
      openedOnRef.current = getCurrentPathname(state) as string;
      returnFocusRef.current = active && active !== document.body ? active : null;
      closingRef.current = 0;
      setPath([]);
      setStagger(true);
      setIsOpen(true);

      const categoryId = payload?.categoryId || getContextCategoryId(state);
      const resolving = dispatch(resolveStartPosition(categoryId) as never) as unknown;

      (resolving as Promise<StartPosition>).catch(() => ROOT_POSITION).then((start) => {
        if (openGenerationRef.current === generation) {
          setPath(start.path);
          setPosition(start);
        }
      });
    };

    UIEvents.addListener(OPEN_CATEGORY_DRAWER, handleOpen);
    return () => {
      UIEvents.removeListener(OPEN_CATEGORY_DRAWER, handleOpen);
    };
  }, [dispatch, store]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    setAppInert(true);
    cancelAnimations(panelRef.current, backdropRef.current);
    animateOpen(panelRef.current, backdropRef.current);

    closeButtonRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && openedOnRef.current && openedOnRef.current !== pathname) {
      closeAnimated(false);
    }
  }, [closeAnimated, isOpen, pathname]);

  useEffect(() => () => {
    setAppInert(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    /**
     * @param keyEvent The key event.
     */
    const handleKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Escape') {
        keyEvent.preventDefault();
        closeAnimated();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeAnimated, isOpen]);

  const levelKey = getLevelKey(path);

  useLayoutEffect(() => {
    if (!leaving) {
      return;
    }

    animateLevels(enteringRef.current, leavingRef.current, leaving.direction).then(() => {
      setLeaving(current => (current === leaving ? null : current));
    });
  }, [leaving]);

  const changeLevel = useCallback((nextPath: PathEntry[], direction: 1 | -1) => {
    setLeaving({
      entry: path[path.length - 1] || null,
      key: getLevelKey(path),
      direction,
    });
    setStagger(false);
    setPath(nextPath);
  }, [path]);

  const handleDrill = useCallback((entry: PathEntry) => {
    changeLevel([...path, entry], 1);
  }, [changeLevel, path]);

  const handleBack = useCallback(() => {
    changeLevel(path.slice(0, -1), -1);
  }, [changeLevel, path]);

  const handleNavigate = useCallback((target: string, state: Record<string, unknown>) => {
    if (target !== pathname) {
      push({
        pathname: target,
        state,
      });
    }

    closeAnimated(false);
  }, [closeAnimated, pathname, push]);

  const handleTouchStart = useCallback((touchEvent: TouchEvent) => {
    const touch = touchEvent.touches[0];
    dragRef.current = touchEvent.touches.length === 1 ? {
      x: touch.clientX,
      y: touch.clientY,
      offset: 0,
      active: false,
    } : null;
  }, []);

  const handleTouchMove = useCallback((touchEvent: TouchEvent) => {
    const drag = dragRef.current;
    if (!drag || closingRef.current) {
      return;
    }

    const touch = touchEvent.touches[0];
    const deltaX = touch.clientX - drag.x;
    const deltaY = touch.clientY - drag.y;

    if (!drag.active) {
      if (Math.abs(deltaY) > DRAG_START && Math.abs(deltaY) > Math.abs(deltaX)) {
        dragRef.current = null;
        return;
      }

      if (deltaX > -DRAG_START || Math.abs(deltaX) < Math.abs(deltaY)) {
        return;
      }

      drag.active = true;
    }

    drag.offset = Math.min(0, deltaX + DRAG_START);
    setDragOffset(panelRef.current, backdropRef.current, drag.offset);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const drag = dragRef.current;
    dragRef.current = null;

    if (!drag?.active) {
      return;
    }

    if (drag.offset < -DRAG_CLOSE) {
      closeAnimated(true, drag.offset);
      return;
    }

    animateOpen(panelRef.current, backdropRef.current, drag.offset);
  }, [closeAnimated]);

  const activeIds = useMemo(() => (position?.activeId ? [
    ...position.path.map(entry => entry.id),
    position.activeId,
  ] : []), [position]);

  if (!isOpen) {
    return null;
  }

  const current = path[path.length - 1] || null;
  const title = current?.name || i18n.text('navigation.categories');
  const levelProps = {
    activeIds,
    showImages,
    showAllProducts,
    onDrill: handleDrill,
    onNavigate: handleNavigate,
  };

  return ReactDOM.createPortal(
    <SurroundPortals portalName={CATEGORY_DRAWER} portalProps={{ categoryId: current?.id }}>
      <div
        className={cx(classes.root, 'theme__category-drawer')}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        data-test-id="CategoryDrawer"
      >
        <div
          className={cx(classes.backdrop, 'theme__category-drawer__backdrop')}
          ref={backdropRef}
          onClick={() => closeAnimated()}
          aria-hidden
        />
        <div
          className={cx(classes.panel, 'theme__category-drawer__panel')}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={i18n.text('navigation.categories')}
        >
          <div
            className={cx(classes.header, 'theme__category-drawer__header')}
            data-has-back={current ? true : undefined}
          >
            <SurroundPortals
              portalName={CATEGORY_DRAWER_HEADER}
              portalProps={{
                categoryId: current?.id,
                onBack: current ? handleBack : undefined,
                onClose: closeAnimated,
              }}
            >
              {current ? (
                <button
                  type="button"
                  className={cx(classes.iconButton, 'theme__category-drawer__back')}
                  onClick={handleBack}
                  aria-label={i18n.text('common.back')}
                  data-test-id="CategoryDrawerBack"
                >
                  <ArrowIcon />
                </button>
              ) : null}
              <h2 className={cx(classes.title, 'theme__category-drawer__title')} key={levelKey}>
                {title}
              </h2>
              <button
                type="button"
                className={cx(classes.iconButton, 'theme__category-drawer__close')}
                onClick={() => closeAnimated()}
                ref={closeButtonRef}
                aria-label={i18n.text('common.close')}
                data-test-id="CategoryDrawerClose"
              >
                <CrossIcon />
              </button>
            </SurroundPortals>
          </div>
          <div className={cx(classes.levels, 'theme__category-drawer__levels')}>
            <RouteContext.Provider value={route}>
              {leaving ? (
                <Level
                  {...levelProps}
                  key={leaving.key}
                  entry={leaving.entry}
                  stagger={false}
                  isLeaving
                  levelRef={(node) => { leavingRef.current = node; }}
                />
              ) : null}
              {position ? (
                <Level
                  {...levelProps}
                  key={levelKey}
                  entry={current}
                  stagger={stagger}
                  levelRef={(node) => { enteringRef.current = node; }}
                />
              ) : null}
            </RouteContext.Provider>
          </div>
        </div>
      </div>
    </SurroundPortals>,
    document.body
  );
};

export default CategoryDrawer;
