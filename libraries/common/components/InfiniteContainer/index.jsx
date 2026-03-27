import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { router } from '@virtuous/conductor';
import { RouteContext } from '../../context';
import { ITEMS_PER_LOAD } from '../../constants/DisplayOptions';

/**
 * Renders a scroll-driven list that loads more items from a data source.
 * @param {Object} props Component props.
 * @returns {JSX.Element}
 */
function InfiniteContainer(props) {
  const {
    items,
    iterator,
    loader,
    columns,
    containerRef,
    enablePromiseBasedLoading,
    initialLimit,
    limit,
    loadingIndicator,
    wrapper,
  } = props;

  const routeContext = useContext(RouteContext) || {};
  const routeId = routeContext.id;
  const { state: { offset: routeOffset = 0 } = {} } = routeContext;

  const currentOffset = items.length ? initialLimit : limit;
  const [state, setState] = useState(() => ({
    itemCount: items.length,
    offset: [routeOffset, currentOffset],
    awaitingItems: true,
  }));

  const { offset, awaitingItems } = state;

  const isLoadingRef = useRef(false);
  const mountedRef = useRef(false);
  const domScrollContainerRef = useRef(null);
  const stateRef = useRef(state);
  const propsRef = useRef(props);
  const isFirstLayoutRef = useRef(true);
  const prevPropsRef = useRef(props);

  stateRef.current = state;
  propsRef.current = props;

  const needsToReceiveItems = useCallback((propsOverride) => {
    const resolvedProps = propsOverride ?? propsRef.current;
    return (
      resolvedProps.totalItems === null
      || resolvedProps.items.length < resolvedProps.totalItems
    );
  }, []);

  const receivedTotalItems = useCallback((previousProps, nextProps) => (
    nextProps.totalItems !== null &&
    nextProps.totalItems !== previousProps.totalItems
  ), []);

  const allItemsAreRendered = useCallback((propsOverride) => {
    const resolvedProps = propsOverride ?? propsRef.current;
    const { totalItems, items: itemsFromProps } = resolvedProps;
    const [renderStartOffset, renderWindowLength] = stateRef.current.offset;

    if (resolvedProps.enablePromiseBasedLoading) {
      return (
        totalItems !== null &&
        (renderStartOffset >= totalItems ||
          (renderStartOffset === 0
            && Array.isArray(itemsFromProps)
            && itemsFromProps.length === totalItems))
      );
    }

    return (
      !needsToReceiveItems(resolvedProps) &&
      renderStartOffset + renderWindowLength >= totalItems
    );
  }, [needsToReceiveItems]);

  const handleLoadingRef = useRef(() => {});
  const handleLoadingPromiseRef = useRef(() => {});

  const throttledLoad = useMemo(
    () => throttle(() => {
      const currentProps = propsRef.current;
      if (currentProps.enablePromiseBasedLoading) {
        handleLoadingPromiseRef.current(currentProps, false);
      } else {
        handleLoadingRef.current(currentProps, false);
      }
    }, 10),
    []
  );

  const bindEvents = useCallback(() => {
    const scrollContainer = domScrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', throttledLoad);
    }
  }, [throttledLoad]);

  const unbindEvents = useCallback((container) => {
    const scrollTarget = container || domScrollContainerRef.current;
    if (scrollTarget) {
      scrollTarget.removeEventListener('scroll', throttledLoad);
    }
  }, [throttledLoad]);

  const stopLazyLoading = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }
    setState(s => ({
      ...s,
      awaitingItems: false,
    }));
    unbindEvents();
  }, [unbindEvents]);

  const verifyAllDone = useCallback((propsOverride) => {
    if (allItemsAreRendered(propsOverride ?? propsRef.current)) {
      stopLazyLoading();
      return true;
    }
    return false;
  }, [allItemsAreRendered, stopLazyLoading]);

  const increaseOffset = useCallback(() => {
    if (!mountedRef.current) {
      const [start] = stateRef.current.offset;
      return {
        offset: start,
        limit: propsRef.current.limit,
      };
    }
    const [start, length] = stateRef.current.offset;
    let newOffset = start + length;
    const limitFromProps = propsRef.current.limit;

    if (start % limitFromProps) {
      newOffset = limitFromProps;
    }
    setState(previousState => ({
      ...previousState,
      offset: [newOffset, limitFromProps],
    }));

    return {
      offset: newOffset,
      limit: limitFromProps,
    };
  }, []);

  const resetComponent = useCallback((callback) => {
    const limitFromProps = propsRef.current.limit;
    setState({
      offset: [0, limitFromProps],
      awaitingItems: true,
      itemCount: 0,
    });
    queueMicrotask(() => {
      if (!mountedRef.current) {
        return;
      }
      unbindEvents();
      bindEvents();
      callback();
    });
  }, [bindEvents, unbindEvents]);

  const validateScrollPosition = useCallback(() => {
    const scrollContainer = domScrollContainerRef.current;
    if (!scrollContainer) {
      return true;
    }

    let scrollTop;
    let scrollHeight;
    let clientHeight;

    if (scrollContainer === window) {
      const body = document.querySelector('body');
      scrollTop = window.scrollY;
      ({ scrollHeight, clientHeight } = body);
    } else {
      ({ scrollTop, scrollHeight, clientHeight } = scrollContainer);
    }

    const { preloadMultiplier } = propsRef.current;
    const scrollPosition = scrollTop + clientHeight;
    const scrollThreshold = scrollHeight - (clientHeight * preloadMultiplier);

    return scrollPosition > scrollThreshold;
  }, []);

  const handleLoading = useCallback((propsOverride, force = false) => {
    const resolvedProps = propsOverride ?? propsRef.current;
    if (isLoadingRef.current) {
      return;
    }

    if (verifyAllDone()) {
      return;
    }

    const [start, length] = stateRef.current.offset;
    const {
      items: itemsFromProps,
      totalItems: totalItemsFromProps,
      loader: loadItems,
    } = resolvedProps;
    const renderLength = start + length;

    if (force || validateScrollPosition()) {
      if (renderLength <= itemsFromProps.length) {
        isLoadingRef.current = true;
        increaseOffset();
      } else if (itemsFromProps.length < totalItemsFromProps) {
        isLoadingRef.current = true;
        loadItems(start);
        if (renderLength < itemsFromProps.length + length) {
          increaseOffset();
        }
      }
    }
  }, [increaseOffset, validateScrollPosition, verifyAllDone]);

  const handleLoadingPromise = useCallback(async (propsOverride, force = false) => {
    const resolvedProps = propsOverride ?? propsRef.current;
    if (isLoadingRef.current) {
      return;
    }

    if (verifyAllDone(resolvedProps)) {
      return;
    }

    if (force || validateScrollPosition()) {
      isLoadingRef.current = true;
      const { loader: loadItems } = resolvedProps;

      try {
        const [offsetForLoaderRequest] = stateRef.current.offset;
        await loadItems(offsetForLoaderRequest);
        if (!mountedRef.current) {
          return;
        }
        increaseOffset();
      } catch {
        if (mountedRef.current) {
          stopLazyLoading();
        }
      } finally {
        isLoadingRef.current = false;
      }
    }
  }, [increaseOffset, stopLazyLoading, validateScrollPosition, verifyAllDone]);

  handleLoadingRef.current = handleLoading;
  handleLoadingPromiseRef.current = handleLoadingPromise;

  useLayoutEffect(() => {
    if (isFirstLayoutRef.current) {
      isFirstLayoutRef.current = false;
      prevPropsRef.current = props;
      return;
    }

    const previousProps = prevPropsRef.current;
    const nextProps = props;

    /**
     * Runs after prop-driven state updates: bind scroll container, maybe load, verify completion.
     * @returns {void}
     */
    const finalize = () => {
      const { current } = nextProps.containerRef;
      if (!domScrollContainerRef.current && current) {
        domScrollContainerRef.current = current;
        bindEvents();
      }

      if (receivedTotalItems(previousProps, nextProps)) {
        if (nextProps.enablePromiseBasedLoading) {
          if (previousProps.totalItems !== null) {
            handleLoadingPromise(nextProps, true);
          }
        } else {
          handleLoading(nextProps, true);
        }
      }

      verifyAllDone(nextProps);
    };

    if (nextProps.requestHash !== previousProps.requestHash) {
      resetComponent(() => {
        finalize();
      });
      prevPropsRef.current = nextProps;
      return;
    }

    if (nextProps.items.length >= stateRef.current.itemCount) {
      setState(previousState => ({
        ...previousState,
        itemCount: nextProps.items.length,
      }));
      queueMicrotask(() => {
        if (mountedRef.current) {
          finalize();
        }
      });
    } else {
      resetComponent(() => {
        finalize();
      });
    }

    prevPropsRef.current = nextProps;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- legacy cWRP: deps are [props] only
  }, [props]);

  useEffect(() => {
    mountedRef.current = true;
    const { current } = containerRef;
    if (current) {
      domScrollContainerRef.current = current;
      bindEvents();
    }

    if (!items.length) {
      const [start] = stateRef.current.offset;
      if (enablePromiseBasedLoading) {
        handleLoadingPromise(propsRef.current, true);
      } else {
        loader(start);
      }
    }

    verifyAllDone();

    return () => {
      mountedRef.current = false;
      if (typeof throttledLoad.cancel === 'function') {
        throttledLoad.cancel();
      }
      if (routeId != null) {
        router.update(routeId, {
          offset: stateRef.current.offset[0],
        }, false);
      }
      unbindEvents();
    };
  // Run once on mount; scroll binding when containerRef appears is handled in layout effect.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!enablePromiseBasedLoading) {
      isLoadingRef.current = false;
    }
  });

  const [renderStartOffset, renderWindowLength] = offset;
  const showLoadingIndicator = !!loadingIndicator && awaitingItems && (
    !enablePromiseBasedLoading || isLoadingRef.current
  );

  const children = items.slice(0, renderStartOffset + renderWindowLength).map(item => iterator({
    ...item,
    columns,
  }));

  const content = (typeof wrapper === 'function') ? (
    wrapper({ children })
  ) : (
    React.createElement(wrapper, {}, children)
  );

  return (
    <div className="common__infinite-container">
      <div>
        {content}
      </div>
      {showLoadingIndicator && loadingIndicator}
    </div>
  );
}

InfiniteContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  iterator: PropTypes.func.isRequired,
  loader: PropTypes.func.isRequired,
  columns: PropTypes.number,
  containerRef: PropTypes.shape(),
  enablePromiseBasedLoading: PropTypes.bool,
  initialLimit: PropTypes.number,
  limit: PropTypes.number,
  loadingIndicator: PropTypes.node,
  // Read via propsRef, not direct destructure.
  // eslint-disable-next-line react/no-unused-prop-types
  preloadMultiplier: PropTypes.number,
  // eslint-disable-next-line react/no-unused-prop-types
  requestHash: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  totalItems: PropTypes.number,
  wrapper: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
};

InfiniteContainer.defaultProps = {
  columns: 2,
  containerRef: { current: null },
  initialLimit: 10,
  limit: ITEMS_PER_LOAD,
  loadingIndicator: null,
  preloadMultiplier: 2,
  requestHash: null,
  totalItems: null,
  wrapper: 'div',
  enablePromiseBasedLoading: false,
};

InfiniteContainer.displayName = 'InfiniteContainer';

export default InfiniteContainer;
