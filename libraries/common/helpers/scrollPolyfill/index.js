/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * https://github.com/iamdustan/smoothscroll
 * - Added scroll to center of the element
 */

const w = window;
const d = document;

/*
 * Aliases
 * w: window global object
 * d: document
 * undefined: undefined
 */

/**
 * Polyfill for smooth scrolling
 */
function polyfill() {
  // Return when scrollBehavior interface is supported
  if ('scrollBehavior' in d.documentElement.style) {
    return;
  }

  /*
   * Globals
   */
  const Element = w.HTMLElement || w.Element;
  const SCROLL_TIME = 468;

  /**
   * Changes scroll position inside an element
   * @method scrollElement
   * @param {number} x The x coordinate
   * @param {number} y The y coordinate
   */
  function scrollElement(x, y) {
    this.scrollLeft = x;
    this.scrollTop = y;
  }

  /*
   * Object gathering original scroll methods
   */
  const original = {
    scroll: w.scroll || w.scrollTo,
    scrollBy: w.scrollBy,
    elScroll: Element.prototype.scroll || scrollElement,
    scrollIntoView: Element.prototype.scrollIntoView,
  };

  /*
   * Define timing method
   */
  const now = w.performance && w.performance.now
    ? w.performance.now.bind(w.performance) : Date.now;

  /**
   * Returns result of applying ease math function to a number
   * @method ease
   * @param {number} k The number
   * @return {number}
   */
  function ease(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  }

  /**
   * Indicates if a smooth behavior should be applied
   * @method shouldBailOut
   * @param {number|Object} x Scroll function params
   * @return {boolean}
   */
  function shouldBailOut(x) {
    if (typeof x !== 'object'
      || x === null
      || x.behavior === undefined
      || x.behavior === 'auto'
      || x.behavior === 'instant') {
      // First arg not an object/null or behavior is auto, instant or undefined
      return true;
    }

    if (typeof x === 'object'
      && x.behavior === 'smooth') {
      // First argument is an object and behavior is smooth
      return false;
    }

    // Throw error when behavior is not supported
    throw new TypeError('behavior not valid');
  }

  /**
   * Finds scrollable parent of an element
   * @method findScrollableParent
   * @param {Node} el The element
   * @return {Node} el The parent
   */
  function findScrollableParent(el) {
    let isBody;
    let hasScrollableSpace;
    let hasVisibleOverflow;
    let parent = el;
    do {
      parent = parent.parentNode;

      // Set condition variables
      isBody = parent === d.body;
      hasScrollableSpace =
        parent.clientHeight < parent.scrollHeight ||
        parent.clientWidth < parent.scrollWidth;
      hasVisibleOverflow =
        w.getComputedStyle(parent, null).overflow === 'visible';
    } while (!isBody && !(hasScrollableSpace && !hasVisibleOverflow));

    isBody = null;
    hasScrollableSpace = null;
    hasVisibleOverflow = null;

    return parent;
  }

  /**
   * Self invoked function that, given a context, steps through scrolling
   * @method step
   * @param {Object} context The context
   */
  function step(context) {
    const tmpContext = context;

    // Call method again on next available frame
    tmpContext.frame = w.requestAnimationFrame(step.bind(w, tmpContext));

    const time = now();
    let elapsed = (time - tmpContext.startTime) / SCROLL_TIME;

    // Avoid elapsed times higher than one
    elapsed = elapsed > 1 ? 1 : elapsed;

    // Apply easing to elapsed time
    const value = ease(elapsed);

    const currentX = tmpContext.startX + ((tmpContext.x - tmpContext.startX) * value);
    const currentY = tmpContext.startY + ((tmpContext.y - tmpContext.startY) * value);

    tmpContext.method.call(tmpContext.scrollable, currentX, currentY);

    // Return when end points have been reached
    if (currentX === tmpContext.x && currentY === tmpContext.y) {
      w.cancelAnimationFrame(tmpContext.frame);
    }
  }

  /**
   * Scrolls window with a smooth behavior
   * @method smoothScroll
   * @param {Object|Node} el A DOM node
   * @param {number} x The x coordinate
   * @param {number} y The < coordinate
   */
  function smoothScroll(el, x, y) {
    let scrollable;
    let startX;
    let startY;
    let method;
    const startTime = now();
    let frame;

    // Define scroll context
    if (el === d.body) {
      scrollable = w;
      startX = w.scrollX || w.pageXOffset;
      startY = w.scrollY || w.pageYOffset;
      method = original.scroll;
    } else {
      scrollable = el;
      startX = el.scrollLeft;
      startY = el.scrollTop;
      method = scrollElement;
    }

    // Cancel frame when a scroll event's happening
    if (frame) {
      w.cancelAnimationFrame(frame);
    }

    // Scroll looping over a frame
    step({
      scrollable,
      method,
      startTime,
      startX,
      startY,
      x,
      y,
      frame,
    });
  }

  /*
   * ORIGINAL METHODS OVERRIDES
   */

  // W.scroll and w.scrollTo
  w.scrollTo = function (...args) {
    // Avoid smooth behavior if not required
    if (shouldBailOut(args[0])) {
      original.scroll.call(
        w,
        args[0].left || args[0],
        args[0].top || args[1]
      );
      return;
    }

    // LET THE SMOOTHNESS BEGIN!
    /* eslint-disable no-bitwise */
    smoothScroll.call(
      w,
      d.body,
      ~~args[0].left,
      ~~args[0].top
    );
    /* eslint-enable no-bitwise */
  };

  w.scroll = w.scrollTo;

  w.scrollBy = function (...args) {
    // Avoid smooth behavior if not required
    if (shouldBailOut(args[0])) {
      original.scrollBy.call(
        w,
        args[0].left || args[0],
        args[0].top || args[1]
      );
      return;
    }

    // LET THE SMOOTHNESS BEGIN!
    /* eslint-disable no-bitwise */
    smoothScroll.call(
      w,
      d.body,
      ~~args[0].left + (w.scrollX || w.pageXOffset),
      ~~args[0].top + (w.scrollY || w.pageYOffset)
    );
    /* eslint-enable no-bitwise */
  };

  // Element.prototype.scroll and Element.prototype.scrollTo
  Element.prototype.scrollTo = function (...args) {
    // Avoid smooth behavior if not required
    if (shouldBailOut(args[0])) {
      original.elScroll.call(
        this,
        args[0].left || args[0],
        args[0].top || args[1]
      );
      return;
    }

    // LET THE SMOOTHNESS BEGIN!
    smoothScroll.call(
      this,
      this,
      args[0].left,
      args[0].top
    );
  };

  Element.prototype.scroll = Element.prototype.scrollTo;

  Element.prototype.scrollBy = function (...args) {
    const arg0 = args[0];

    if (typeof arg0 === 'object') {
      this.scroll({
        left: arg0.left + this.scrollLeft,
        top: arg0.top + this.scrollTop,
        behavior: arg0.behavior,
      });
    } else {
      this.scroll(
        this.scrollLeft + arg0,
        this.scrollTop + args[1]
      );
    }
  };

  Element.prototype.scrollIntoView = function (...args) {
    // Avoid smooth behavior if not required
    if (shouldBailOut(args[0])) {
      original.scrollIntoView.call(this, args[0] || true);
      return;
    }

    // LET THE SMOOTHNESS BEGIN!
    const scrollableParent = findScrollableParent(this);
    const parentRects = scrollableParent.getBoundingClientRect();
    const clientRects = this.getBoundingClientRect();

    if (scrollableParent !== d.body) {
      // Reveal element inside parent
      smoothScroll.call(
        this,
        scrollableParent,
        scrollableParent.scrollLeft + (clientRects.left - parentRects.left),
        (scrollableParent.scrollTop + (clientRects.top - parentRects.top)) + args[0].yOffset
      );
      // Reveal parent in viewport
      w.scrollBy({
        left: parentRects.left,
        top: parentRects.top,
        behavior: 'smooth',
      });
    } else {
      // Reveal element in viewport
      w.scrollBy({
        left: clientRects.left,
        top: clientRects.top,
        behavior: 'smooth',
      });
    }
  };
}

export default polyfill;
