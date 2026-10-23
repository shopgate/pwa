import { useCallback, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@shopgate/engage/core/hooks';
import { useCategoryImageRatio } from '@shopgate/engage/category/hooks';
import { CATEGORY_DRAWER_SHOW_ALL_PRODUCTS } from '@shopgate/engage/category/constants';
import { getCategoryRoute, getShowAllProductsFilters } from '@shopgate/engage/category/helpers';
import { i18n } from '@shopgate/engage/core/helpers';
import { Portal } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles, keyframes } from '@shopgate/engage/styles';
import Row, { RowButton } from './Row';
import Tile from './Tile';
import LoadingBar from './LoadingBar';
import { useLevel } from './hooks';
import { loadCategory } from './startPosition';
import type {
  CategoryState, CurrentMark, DrawerCategory, PathEntry,
} from './types';

const IMAGE_HEIGHT = 30;
const IMAGE_REQUEST_WIDTH = 324;
const TILE_IMAGE_WIDTH = 440;
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
    '&[data-leaving]': {
      pointerEvents: 'none',
    },
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(var(--category-drawer-columns, 2), minmax(0, 1fr))',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
  overview: {
    borderBottom: `1px solid ${theme.components.separatorLine.borderColor}`,
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
  /** The category the visitor is in and its ancestors, root first. */
  activeIds: string[];
  /** Whether the entries fly in one after another. */
  stagger: boolean;
  showImages: boolean;
  showAllProducts: boolean;
  /** Whether the categories show as a list or as image tiles. */
  layout: 'list' | 'grid';
  /** Number of tile columns in the grid layout. */
  columns: number;
  onDrill: (entry: PathEntry) => void;
  onNavigate: (pathname: string, state: Record<string, unknown>) => void;
  /** Called before the focused element of the level disappears. */
  onFocusLost: () => void;
  /** Whether the level is on its way out. */
  isLeaving?: boolean;
  levelRef?: (node: HTMLDivElement | null) => void;
}

/**
 * One level of the category drawer.
 * @returns The categories of the level.
 */
const Level = ({
  entry,
  activeIds,
  stagger,
  showImages,
  showAllProducts,
  layout,
  columns,
  onDrill,
  onNavigate,
  onFocusLost,
  isLeaving = false,
  levelRef,
}: LevelProps) => {
  const { classes, cx } = useStyles();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const {
    ids, isLoading, hasError, retry,
  } = useLevel(entry ? entry.id : null);
  const parentCategory = useSelector((state: CategoryState) => (
    entry ? state.category.categoriesById[entry.id] : undefined
  ));
  const dispatch = useAppDispatch();
  const image = useCategoryImageRatio(IMAGE_REQUEST_WIDTH, IMAGE_HEIGHT);
  const tileImage = useCategoryImageRatio(TILE_IMAGE_WIDTH);
  const isGrid = layout === 'grid';
  const showOverview = Boolean(entry && showAllProducts && parentCategory?.name);
  const needsParentCategory = Boolean(entry && showAllProducts && !parentCategory?.name);
  const activeId = activeIds[activeIds.length - 1];
  const hasActiveRow = Boolean(ids?.some(id => activeIds.includes(id)));
  const isEmpty = Boolean(entry && ids && !ids.length);

  const getMark = (id: string): CurrentMark => {
    if (id === activeId) {
      return 'page';
    }

    return activeIds.includes(id) ? 'path' : null;
  };

  useEffect(() => {
    if (needsParentCategory && entry) {
      dispatch(loadCategory(entry.id));
    }
  }, [dispatch, entry, needsParentCategory]);

  useEffect(() => {
    if (!stagger || !hasActiveRow) {
      return;
    }

    const active = rootRef.current?.querySelector('[data-current]');
    if (active && typeof active.scrollIntoView === 'function') {
      active.scrollIntoView({ block: 'center' });
    }
  }, [hasActiveRow, stagger]);

  useEffect(() => {
    if (isEmpty && entry && !isLeaving) {
      onNavigate(getCategoryRoute(entry.id), {
        categoryId: entry.id,
        title: entry.name,
      });
    }
  }, [entry, isEmpty, isLeaving, onNavigate]);

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
    if (!entry || !parentCategory) {
      return;
    }

    onNavigate(`${getCategoryRoute(entry.id)}/all`, {
      categoryName: entry.name,
      categoryId: entry.id,
      filters: getShowAllProductsFilters(parentCategory),
    });
  }, [entry, onNavigate, parentCategory]);

  const handleRetry = useCallback(() => {
    onFocusLost();
    retry();
  }, [onFocusLost, retry]);

  const hasList = showOverview || (!isGrid && !!ids?.length);

  return (
    <div
      className={cx(classes.root, 'theme__category-drawer__level')}
      ref={(node) => {
        rootRef.current = node;
        node?.toggleAttribute('inert', isLeaving);
        levelRef?.(node);
      }}
      aria-hidden={isLeaving ? true : undefined}
      aria-busy={isLoading ? true : undefined}
      data-leaving={isLeaving ? true : undefined}
      data-test-id={isLeaving ? undefined : 'CategoryDrawerLevel'}
    >
      {isLoading ? <LoadingBar className="theme__category-drawer__level__loading" /> : null}
      {hasList ? (
        // eslint-disable-next-line jsx-a11y/no-redundant-roles
        <ul
          className={cx(classes.list, 'theme__category-drawer__list')}
          role="list"
          data-stagger={stagger ? true : undefined}
        >
          {showOverview && entry ? (
            <li className={cx(classes.overview, 'theme__category-drawer__overview')}>
              <Portal name={CATEGORY_DRAWER_SHOW_ALL_PRODUCTS} props={{ categoryId: entry.id }}>
                <RowButton
                  label={i18n.text('category.showAllProducts.label')}
                  onClick={handleOverview}
                  isEmphasized
                  testId="CategoryDrawerOverview"
                />
              </Portal>
            </li>
          ) : null}
          {!isGrid ? (ids || []).map(id => (
            <Row
              key={id}
              categoryId={id}
              mark={getMark(id)}
              image={showImages ? image : null}
              onSelect={handleSelect}
            />
          )) : null}
        </ul>
      ) : null}
      {isGrid && ids?.length ? (
        // eslint-disable-next-line jsx-a11y/no-redundant-roles
        <ul
          className={cx(classes.list, classes.grid, 'theme__category-drawer__grid')}
          role="list"
          style={{ '--category-drawer-columns': columns } as CSSProperties}
          data-stagger={stagger ? true : undefined}
        >
          {ids.map(id => (
            <Tile
              key={id}
              categoryId={id}
              mark={getMark(id)}
              image={tileImage}
              onSelect={handleSelect}
            />
          ))}
        </ul>
      ) : null}
      {hasError ? (
        <div className={cx(classes.error, 'theme__category-drawer__error')} role="alert">
          {i18n.text('common.error')}
          <Button variant="outlined" size="large" onClick={handleRetry}>
            {i18n.text('category.drawer.retry')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Level;
