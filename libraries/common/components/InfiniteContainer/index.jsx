import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';
import { router } from '@virtuous/conductor';
import { RouteContext } from '../../context';
import { ITEMS_PER_LOAD } from '../../constants/DisplayOptions';

/**
 * This component receives a data source and will then load
 * more items from it when the user reaches the end of the
 * (parent) scroll container.
 */
class InfiniteContainer extends Component {
  static contextType = RouteContext;

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    iterator: PropTypes.func.isRequired,
    loader: PropTypes.func.isRequired,
    columns: PropTypes.number,
    containerRef: PropTypes.shape(),
    enablePromiseBasedLoading: PropTypes.bool,
    initialLimit: PropTypes.number,
    limit: PropTypes.number,
    loadingIndicator: PropTypes.node,
    preloadMultiplier: PropTypes.number,
    requestHash: PropTypes.string,
    totalItems: PropTypes.number,
    wrapper: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]),
  };

  static defaultProps = {
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

  /**
   * The component constructor.
   * @param {Object} props The component props.
   * @param {Object} context The component context.
   */
  constructor(props, context) {
    super(props, context);

    this.domElement = null;
    this.domScrollContainer = null;
    /**
     * 10ms was chosen because, on the one hand, it prevents the scroll event from flooding but,
     * on the other hand, it does not hinder users that scroll quickly from reloading next chunk.
     */
    this.handleLoadingProxy = throttle(() => {
      if (props.enablePromiseBasedLoading) {
        this.handleLoadingPromise();
      } else {
        this.handleLoading();
      }
    }, 10);

    // A flag to prevent concurrent loading requests.
    this.isLoading = false;

    // Determine the initial offset of items.
    const { items, limit, initialLimit } = props;
    const currentOffset = items.length ? initialLimit : limit;
    const { state: { offset = 0 } = {} } = context || {};

    this.state = {
      itemCount: items.length,
      offset: [offset, currentOffset],
      // A state flag that will be true as long as we await more items.
      // The loading indicator will be shown accordingly.
      awaitingItems: true,
    };
  }

  /**
   * When the component is mounted, it tries to find a proper
   * parent scroll container if available.
   * After that it calls for the initial data to load.
   */
  componentDidMount() {
    const { current } = this.props.containerRef;
    if (current) {
      this.domScrollContainer = current;
      this.bindEvents();
    }

    // Initially request items if none received.
    if (!this.props.items.length) {
      const [start] = this.state.offset;
      this.props.loader(start);
    }

    this.verifyAllDone();
  }

  /**
   * Checks if the component received new items or already received all items.
   * @param {Object} nextProps The next props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    /**
     * Downstream logic to process the props. It's wrapped into a separate function, since it might
     * be executed after the state was updated to avoid race conditions.
     */
    const finalize = () => {
      const { current } = nextProps.containerRef;
      if (!this.domScrollContainer && current) {
        this.domScrollContainer = current;
        this.bindEvents();
      }

      if (this.receivedTotalItems(nextProps)) {
        // Trigger loading if totalItems are available
        if (nextProps.enablePromiseBasedLoading) {
          this.handleLoadingPromise(true, nextProps);
        } else {
          this.handleLoading(true, nextProps);
        }
      }

      this.verifyAllDone(nextProps);
    };

    if (nextProps.requestHash !== this.props.requestHash) {
      this.resetComponent(() => {
        finalize();
      });

      return;
    }

    if (nextProps.items.length >= this.state.itemCount) {
      this.setState({
        itemCount: nextProps.items.length,
      }, finalize());
    } else {
      this.resetComponent(() => {
        finalize();
      });
    }
  }

  /**
   * Let the component only update when props.items or state changes.
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.props.containerRef, nextProps.containerRef) ||
      !isEqual(this.props.items, nextProps.items) ||
      !isEqual(this.state, nextState)
    );
  }

  /**
   * Reset the loading flag.
   */
  componentDidUpdate() {
    // When promise based implementation is active, `isLoading` is reset when response comes in.
    // In the legacy implementation this happens after the fetched items reached the component and
    // is not necessary here anymore.
    if (!this.props.enablePromiseBasedLoading) {
      this.isLoading = false;
    }
  }

  /**
   * When the component will unmount it unbinds all previously bound event listeners.
   */
  componentWillUnmount() {
    router.update(this.context.id, {
      offset: this.state.offset[0],
    }, false);
    this.unbindEvents();
  }

  /**
   * Adds scroll event listeners to the scroll container if available.
   */
  bindEvents() {
    if (this.domScrollContainer) {
      this.domScrollContainer.addEventListener('scroll', this.handleLoadingProxy);
    }
  }

  /**
   * Removes scroll event listeners from the scroll container.
   * @param {Node} container A reference to an old scroll container.
   */
  unbindEvents(container) {
    if (container) {
      container.removeEventListener('scroll', this.handleLoadingProxy);
    } else if (this.domScrollContainer) {
      this.domScrollContainer.removeEventListener('scroll', this.handleLoadingProxy);
    }
  }

  /**
   * Tests if there are more items to be received via items prop.
   * @param {Object} [props] The current or next component props.
   * @returns {boolean}
   */
  needsToReceiveItems(props = this.props) {
    return (
      props.totalItems === null
      || props.items.length < props.totalItems
    );
  }

  /**
   * Tests if the total amount of items has been received via totalItems prop.
   * @param {Object} nextProps The next component props.
   * @returns {boolean}
   */
  receivedTotalItems(nextProps) {
    return (
      nextProps.totalItems !== null &&
      nextProps.totalItems !== this.props.totalItems
    );
  }

  /**
   * Tests if all items have been received and are visible based on current offset.
   * @param {Object} [props] The current or next component props.
   * @returns {boolean}
   */
  allItemsAreRendered(props = this.props) {
    const { totalItems, items } = props;
    const [offset, limit] = this.state.offset;

    if (props.enablePromiseBasedLoading) {
      // At promise based loading the offset is increased after the response came in.
      // This method is invoked to evaluate if a new request needs to be dispatched, so we check
      // against the current offset state.
      return (
        totalItems !== null &&
        (offset >= totalItems ||
          (offset === 0 && Array.isArray(items) && items.length === totalItems))
      );
    }

    return (
      !this.needsToReceiveItems(props) &&
      offset + limit >= totalItems
    );
  }

  /**
   * Increases the current offset by limit (from props).
   * @returns {Object}
   */
  increaseOffset() {
    const [start, length] = this.state.offset;
    let newOffset = start + length;

    /**
     * When items are cached, the initial limit can be "6".
     * Then, new offset should be limited to the "normal" limit (30).
     * Otherwise, with cached items, this component would skip the initial number of items
     * when the cache is out.
     */
    if (start % this.props.limit) {
      // Example: when 6, bump to 30, not 36.
      newOffset = this.props.limit;
    }
    this.setState({
      offset: [newOffset, this.props.limit],
    });

    return {
      offset: newOffset,
      limit: this.props.limit,
    };
  }

  /**
   * Resets the state.
   * @param {Function} callback A callback which is invoked after the state was updated.
   *   This is necessary to avoid race conditions with downstream code.
   */
  resetComponent(callback) {
    this.setState({
      offset: [0, this.props.limit],
      awaitingItems: true,
      itemCount: 0,
    }, () => {
      this.unbindEvents();
      this.bindEvents();
      callback();
    });
  }

  /**
   * Stops the lazy loading processes
   */
  stopLazyLoading() {
    this.setState({ awaitingItems: false });
    this.unbindEvents();
  }

  /**
   * Verifies if all items are loaded and shown, then set final state and unbind events.
   * @param {Object} [props] The current or next component props.
   * @returns {boolean} Returns true if the component has reached the final state.
   */
  verifyAllDone(props = this.props) {
    if (this.allItemsAreRendered(props)) {
      this.stopLazyLoading();

      return true;
    }

    return false;
  }

  /**
   * Tests if the current scroll position is near the bottom
   * of the scroll container.
   * @returns {boolean}
   */
  validateScrollPosition() {
    if (!this.domScrollContainer) {
      return true;
    }

    let scrollTop;
    let scrollHeight;
    let clientHeight;

    if (this.domScrollContainer === window) {
      const body = document.querySelector('body');
      scrollTop = window.scrollY;
      ({ scrollHeight, clientHeight } = body);
    } else {
      ({ scrollTop, scrollHeight, clientHeight } = this.domScrollContainer);
    }

    const { preloadMultiplier } = this.props;
    const scrollPosition = scrollTop + clientHeight;
    const scrollThreshold = scrollHeight - (clientHeight * preloadMultiplier);

    return scrollPosition > scrollThreshold;
  }

  /**
   * Handles incrementing of render offset and the request of new items if necessary.
   * @param {boolean} [force] If set to true, proceed independently of scroll validation.
   * @param {Object} [props] The current or next component props.
   */
  handleLoading(force = false, props = this.props) {
    // Do not load if there is an update in progress.
    if (this.isLoading) {
      return;
    }

    if (this.verifyAllDone()) {
      return;
    }

    const [start, length] = this.state.offset;
    const { items, totalItems, loader } = props;
    const renderLength = start + length;

    if (force || this.validateScrollPosition()) {
      // Check if we need to render items that we already received.
      if (renderLength <= items.length) {
        // Render already received items by increasing the offset.
        this.isLoading = true;
        this.increaseOffset();
      } else if (items.length < totalItems) {
        // We already rendered all received items but there are more available.
        // Therefore request new items.
        this.isLoading = true;
        loader(start);
        // If necessary increase render offset for upcoming items.
        if (renderLength < items.length + length) {
          this.increaseOffset();
        }
      }
    }
  }

  /**
   * Handles incrementing of render offset and the request of new items if necessary.
   *
   * Other than the regular handleLoading method this one requires that the loader returns a promise
   * that can be used to check if we received a response for a request. That check is needed
   * for offset handling.
   * @param {boolean} [force] If set to true, proceed independently of scroll validation.
   * @param {Object} [props] The current or next component props.
   */
  async handleLoadingPromise(force = false, props = this.props) {
    if (this.isLoading) {
      return;
    }

    if (this.verifyAllDone()) {
      return;
    }

    if (force || this.validateScrollPosition()) {
      // Add isLoading state to prevent requests while the current one is running
      this.isLoading = true;

      const { loader } = props;

      try {
        const [offset] = this.state.offset;
        // Dispatch the request
        await loader(offset);
        // Increase the offset for the next request
        this.increaseOffset();
      } catch (e) {
        // Stop lazy loading processes on request error
        this.stopLazyLoading();
      }

      // Remove the loading state to enable next request
      this.isLoading = false;
    }
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      wrapper,
      items,
      iterator,
      loadingIndicator,
      columns,
    } = this.props;
    const { awaitingItems } = this.state;
    const [start, length] = this.state.offset;
    // Only show items in offset range. uses iterator component as item factory
    const children = items.slice(0, start + length).map(item => iterator({
      ...item,
      columns,
    }));

    const content = (typeof wrapper === 'function') ? (
      wrapper({ children })
    ) : (
      React.createElement(wrapper, {}, children)
    );

    return (
      <div ref={(elementRef) => { this.domElement = elementRef; }} className="common__infinite-container">
        <div>
          {content}
        </div>
        {awaitingItems && loadingIndicator}
      </div>
    );
  }
}

export default InfiniteContainer;
