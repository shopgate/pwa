import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { CATEGORY_PATH } from '@shopgate/engage/category/constants';
import { getCategoryRoute, getShowAllProductsFilters } from '@shopgate/engage/category/helpers';
import { bin2hex, i18n } from '@shopgate/engage/core/helpers';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles, keyframes } from '@shopgate/engage/styles';
import Row, { RowButton } from './Row';
import { useLevel } from './hooks';
import type { CategoryState, DrawerCategory, PathEntry } from './types';

const STAGGER_STEP = 30;
const STAGGER_ITEMS = 10;

const flyIn = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateX(-24px)',
  },
  '100%': {
    opacity: 1,
    transform: 'none',
  },
});

const loadingSweep = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(250%)' },
});

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
    paddingBottom: theme.layout.safeArea.bottom,
    background: theme.palette.background.surface,
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    '@media (prefers-reduced-motion: no-preference)': {
      '&[data-stagger] > li': {
        animation: `${flyIn} 260ms cubic-bezier(0.2, 0, 0, 1) both`,
      },
      ...Object.fromEntries(Array.from({ length: STAGGER_ITEMS }, (_, index) => [
        `&[data-stagger] > li:nth-of-type(${index + 1})`,
        { animationDelay: `${90 + (index * STAGGER_STEP)}ms` },
      ])),
      [`&[data-stagger] > li:nth-of-type(n+${STAGGER_ITEMS + 1})`]: {
        animationDelay: `${90 + (STAGGER_ITEMS * STAGGER_STEP)}ms`,
      },
    },
  },
  overview: {
    borderBottom: `1px solid ${theme.components.separatorLine.borderColor}`,
  },
  loading: {
    position: 'relative',
    height: 2,
    overflow: 'hidden',
    color: theme.palette.primary.main,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '40%',
      background: 'currentColor',
      opacity: 0.6,
    },
    '@media (prefers-reduced-motion: no-preference)': {
      '&::before': {
        animation: `${loadingSweep} 1.1s ease-in-out infinite`,
      },
    },
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1.5),
    padding: theme.spacing(3, 2),
    color: theme.palette.text.secondary,
  },
}));

interface LevelProps {
  /** The category whose children the level lists, or null for the root level. */
  entry: PathEntry | null;
  /** The category the visitor is in and its ancestors. */
  activeIds: string[];
  /** Whether the entries fly in one after another. */
  stagger: boolean;
  showImages: boolean;
  showAllProducts: boolean;
  onDrill: (entry: PathEntry) => void;
  onNavigate: (pathname: string, state: Record<string, unknown>) => void;
  /** Whether the level is on its way out. */
  isLeaving?: boolean;
  levelRef?: (node: HTMLDivElement | null) => void;
}

/**
 * One level of the category drawer.
 * @param props The component props.
 * @param props.entry The category whose children the level lists, or null for the root level.
 * @param props.activeIds The category the visitor is in and its ancestors.
 * @param props.stagger Whether the entries fly in one after another.
 * @param props.showImages Whether categories show their image.
 * @param props.showAllProducts Whether the level starts with all products of its category.
 * @param props.onDrill Called with a category to show its children.
 * @param props.onNavigate Called with a path and its route state to open a page.
 * @param props.isLeaving Whether the level is on its way out.
 * @param props.levelRef Receives the element of the level.
 * @returns The categories of the level.
 */
const Level = ({
  entry,
  activeIds,
  stagger,
  showImages,
  showAllProducts,
  onDrill,
  onNavigate,
  isLeaving = false,
  levelRef,
}: LevelProps) => {
  const { classes, cx } = useStyles();
  const listRef = useRef<HTMLUListElement>(null);
  const {
    ids, isLoading, hasError, retry,
  } = useLevel(entry ? entry.id : null);
  const parentCategory = useSelector((state: CategoryState) => (
    entry ? state.category.categoriesById[entry.id] : undefined
  ));
  const activeId = activeIds[activeIds.length - 1];
  const hasActiveRow = Boolean(ids?.some(id => activeIds.includes(id)));

  useEffect(() => {
    if (!stagger || !hasActiveRow) {
      return;
    }

    const active = listRef.current?.querySelector('[aria-current]');
    if (active && typeof active.scrollIntoView === 'function') {
      active.scrollIntoView({ block: 'center' });
    }
  }, [hasActiveRow, stagger]);

  const handleSelect = useCallback((category: DrawerCategory) => {
    if (category.childrenCount) {
      onDrill({
        id: category.id,
        name: category.name || '',
      });
      return;
    }

    onNavigate(getCategoryRoute(category.id), {
      categoryId: category.id,
      title: category.name,
    });
  }, [onDrill, onNavigate]);

  const handleOverview = useCallback(() => {
    if (!entry) {
      return;
    }

    if (showAllProducts) {
      onNavigate(`${CATEGORY_PATH}/${bin2hex(entry.id)}/all`, {
        categoryName: entry.name,
        categoryId: entry.id,
        filters: getShowAllProductsFilters(parentCategory || entry),
      });
      return;
    }

    onNavigate(getCategoryRoute(entry.id), {
      categoryId: entry.id,
      title: entry.name,
    });
  }, [entry, onNavigate, parentCategory, showAllProducts]);

  return (
    <div
      className={cx(classes.root, 'theme__category-drawer__level')}
      ref={levelRef}
      aria-hidden={isLeaving ? true : undefined}
      data-test-id={isLeaving ? undefined : 'CategoryDrawerLevel'}
    >
      {isLoading ? <div className={classes.loading} aria-hidden /> : null}
      <ul
        className={cx(classes.list, 'theme__category-drawer__list')}
        ref={listRef}
        data-stagger={stagger ? true : undefined}
        aria-busy={isLoading ? true : undefined}
      >
        {entry ? (
          <li className={cx(classes.overview, 'theme__category-drawer__overview')}>
            <RowButton
              label={i18n.text(showAllProducts
                ? 'category.showAllProducts.label'
                : 'category.drawer.show_all')}
              onClick={handleOverview}
              isActive={!showAllProducts && entry.id === activeId}
              isEmphasized
              testId="CategoryDrawerOverview"
            />
          </li>
        ) : null}
        {(ids || []).map(id => (
          <Row
            key={id}
            categoryId={id}
            isActive={activeIds.includes(id)}
            showImage={showImages}
            onSelect={handleSelect}
          />
        ))}
      </ul>
      {hasError ? (
        <div className={cx(classes.error, 'theme__category-drawer__error')} role="alert">
          {i18n.text('common.error')}
          <Button variant="outlined" onClick={retry}>
            {i18n.text('category.drawer.retry')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Level;
