import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import KeyboardConsumer from '@shopgate/pwa-common/components/KeyboardConsumer';
import { useElementSize } from '@shopgate/engage/core/hooks';
import { getModalCount } from '@shopgate/engage/a11y/selectors';
import { makeStyles } from '@shopgate/engage/styles';
import { setCSSCustomProp } from '@shopgate/engage/styles/helpers';
import type { FooterBarVariant } from '@shopgate/engage/settings/types/appSettings';
import { APP_FOOTER_BARS_ID } from '../Footer/constants';

export interface FooterBarProps {
  variant: FooterBarVariant;
  /** Space in px between a floating bar and a visible tab bar. */
  gap?: number;
  className?: string;
  children: ReactNode;
}

const FLOATING_MIN_OFFSET = '16px';
const SAFE_AREA_BOTTOM = 'var(--safe-area-inset-bottom)';
const TAB_BAR_HEIGHT = 'var(--tabbar-height, 0px)';

const heights = new Map<object, string>();

/**
 * Publishes the height of the mounted footer bars, so page content and snack bars keep clear.
 */
const syncHeights = () => {
  const values = Array.from(heights.values());
  setCSSCustomProp('--footer-bar-height', values.length ? `max(${values.join(', ')})` : '0px');
};

/**
 * Builds the distance between the bottom of the screen and the bar surface.
 * @param variant The bar variant.
 * @param gap The gap above a visible tab bar.
 * @returns The CSS offset between the bottom of the screen and the bar surface.
 */
const getBottomOffset = (variant: FooterBarVariant, gap: number) => (variant === 'floating'
  ? `max(calc(${TAB_BAR_HEIGHT} + ${gap}px), ${FLOATING_MIN_OFFSET}, ${SAFE_AREA_BOTTOM})`
  : `max(${TAB_BAR_HEIGHT}, ${SAFE_AREA_BOTTOM})`);

const useStyles = makeStyles({ name: 'FooterBar' })(theme => ({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    pointerEvents: 'none',
    transition: 'padding-bottom 0.2s ease-in-out, bottom 0.2s ease-in-out',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
    '&[data-variant="fixed"]': {
      paddingBottom: TAB_BAR_HEIGHT,
    },
    '&[data-variant="floating"]': {
      padding: `0 ${theme.spacing(2)}px`,
      paddingBottom: 'var(--footer-bar-offset)',
    },
    '&[data-empty]': {
      visibility: 'hidden',
    },
  },
  surface: {
    pointerEvents: 'auto',
    background: theme.palette.background.surface,
    transition: 'padding-bottom 0.2s ease-in-out',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
    '[data-variant="fixed"] > &': {
      boxShadow: '0 -4px 5px -2px rgba(0, 0, 0, 0.1)',
      paddingBottom: `max(0px, calc(${SAFE_AREA_BOTTOM} - ${TAB_BAR_HEIGHT}))`,
      maxHeight: '50vh',
      overflowY: 'auto',
    },
    '[data-variant="floating"] > &': {
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.components.tabBar.floatingBoxShadow,
      overflow: 'hidden',
    },
  },
}));

/**
 * A bar at the bottom of a page. It renders into the app footer in front of the tab bar and sits
 * on top of it, either spanning the full width or floating as a pill. Its height is published to
 * the page via `--footer-bar-height`.
 * @returns The bar.
 */
const FooterBar = ({
  variant, gap = 8, className, children,
}: FooterBarProps) => {
  const { classes, cx } = useStyles();
  const contentRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef({});
  const { height } = useElementSize(contentRef);
  const offset = getBottomOffset(variant, gap);
  const hasOpenModal = useSelector(getModalCount) > 0;
  const [hasFocus, setHasFocus] = useState(false);
  const handleFocus = useCallback(() => setHasFocus(true), []);
  const handleBlur = useCallback(() => setHasFocus(false), []);

  useEffect(() => {
    const key = keyRef.current;

    if (height > 0) {
      heights.set(key, `calc(${height}px + ${offset})`);
    } else {
      heights.delete(key);
    }

    syncHeights();

    return () => {
      heights.delete(key);
      syncHeights();
    };
  }, [height, offset]);

  const target = typeof document !== 'undefined'
    ? document.getElementById(APP_FOOTER_BARS_ID)
    : null;

  if (!target) {
    return null;
  }

  return createPortal((
    <KeyboardConsumer>
      {(keyboard: { overlap: number }) => (
        <div
          className={cx(classes.root, 'engage__footer-bar', className)}
          data-variant={variant}
          data-empty={height === 0 ? 'true' : undefined}
          aria-hidden={hasOpenModal || undefined}
          style={{
            '--footer-bar-offset': offset,
            bottom: hasFocus && keyboard.overlap > 0 ? keyboard.overlap : undefined,
          } as CSSProperties}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <div className={cx(classes.surface, 'engage__footer-bar__surface')}>
            <div ref={contentRef}>
              {children}
            </div>
          </div>
        </div>
      )}
    </KeyboardConsumer>
  ), target);
};

export default FooterBar;
