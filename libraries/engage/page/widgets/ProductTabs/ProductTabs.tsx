import {
  useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent,
} from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import { WidgetContext } from '@shopgate/engage/page/components/Widgets';
import WidgetHeadline from '../../components/WidgetHeadline';
import ProductSliderWidget from '../ProductSlider';
import { TAB_SLIDE, useProductTabsWidget, useTabSlideAnimation } from './hooks';

const useStyles = makeStyles()(theme => ({
  tabList: {
    position: 'relative',
    display: 'flex',
    gap: theme.spacing(3),
    overflowX: 'auto',
    padding: theme.spacing(0, 2),
    borderBottom: `1px solid ${theme.palette.background.emphasized}`,
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  tab: {
    position: 'relative',
    flexShrink: 0,
    margin: 0,
    padding: theme.spacing(1.5, 0, 0.75),
    border: 0,
    background: 'none',
    color: theme.palette.text.secondary,
    font: 'inherit',
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: `color ${TAB_SLIDE.duration}ms ${TAB_SLIDE.easing}`,
    '&[aria-selected="true"]': {
      color: theme.palette.text.primary,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: -2,
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    background: theme.palette.primary.main,
    transformOrigin: 'left',
  },
  panel: {
    paddingTop: theme.spacing(1.5),
  },
}));

/** The ProductTabsWidget shows several product groups in tabs, each as a product slider. */
const ProductTabs = () => {
  const {
    widget, headline, tabs, sliderSettings,
  } = useProductTabsWidget();
  const { classes, cx } = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = Math.min(selectedIndex, Math.max(tabs.length - 1, 0));
  const tabListRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const previousSelected = useRef(selected);
  const reduceMotion = useReduceMotion();
  const panelRef = useTabSlideAnimation(selected, reduceMotion);
  const tab = tabs[selected];

  const sliderContext = useMemo(() => ({
    ...widget,
    config: {
      ...sliderSettings,
      products: tab?.products,
    },
  }), [widget, sliderSettings, tab]);

  useLayoutEffect(() => {
    const from = previousSelected.current;
    previousSelected.current = selected;
    const list = tabListRef.current;
    const tabElements = list?.querySelectorAll<HTMLElement>('[role="tab"]');
    const current = tabElements?.[selected];

    if (!list || !tabElements || !current) return;

    const inset = tabElements[0].offsetLeft;
    const scrollLeft = Math.min(
      current.offsetLeft - inset,
      Math.max(list.scrollLeft, current.offsetLeft + current.offsetWidth + inset - list.clientWidth)
    );

    if (scrollLeft !== list.scrollLeft) {
      list.scrollTo?.({
        left: scrollLeft,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }

    const previous = tabElements[from];
    if (from === selected || !previous || !indicatorRef.current?.animate || reduceMotion) return;

    const offset = previous.offsetLeft - current.offsetLeft;
    const scale = previous.offsetWidth / current.offsetWidth;
    indicatorRef.current.animate([
      { transform: `translateX(${offset}px) scaleX(${scale})` },
      { transform: 'none' },
    ], TAB_SLIDE);
  }, [selected, reduceMotion]);

  if (!tabs.length) return null;

  const headlineId = `widget-${widget.code}-product-tabs-headline`;
  const panelId = `widget-${widget.code}-product-tabs-panel`;
  const tabId = (index: number) => `widget-${widget.code}-product-tabs-tab-${index}`;

  const select = (index: number, focus = false) => {
    setSelectedIndex(index);

    if (focus) {
      tabListRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[index]?.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const last = tabs.length - 1;
    const next = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    }[event.key];

    if (next === undefined) return;

    event.preventDefault();
    select(next, true);
  };

  return (
    <div className="widget__product-tabs">
      {headline ? <WidgetHeadline headline={headline} id={headlineId} /> : null}
      <div
        ref={tabListRef}
        role="tablist"
        aria-labelledby={headline ? headlineId : undefined}
        className={cx(classes.tabList, 'widget__product-tabs__tab-list')}
      >
        {tabs.map((entry, index) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            type="button"
            role="tab"
            id={tabId(index)}
            aria-selected={index === selected}
            aria-controls={panelId}
            tabIndex={index === selected ? 0 : -1}
            className={cx(classes.tab, 'widget__product-tabs__tab')}
            onClick={() => select(index)}
            onKeyDown={handleKeyDown}
          >
            {entry.label}
            {index === selected ? (
              <span
                ref={indicatorRef}
                className={cx(classes.indicator, 'widget__product-tabs__indicator')}
              />
            ) : null}
          </button>
        ))}
      </div>
      <div
        ref={panelRef}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId(selected)}
        className={cx(classes.panel, 'widget__product-tabs__panel')}
      >
        <WidgetContext.Provider value={sliderContext}>
          <ProductSliderWidget key={selected} />
        </WidgetContext.Provider>
      </div>
    </div>
  );
};

export default ProductTabs;
